import { FEATURE_LABELS } from "./feature-labels";
import { formatReferenceKey } from "./stats";
import type { ClassTemplate } from "@/types/character";

/** A single choice's detail block, shared by class/species/background templates. */
export type ChoiceDetail = NonNullable<
  ClassTemplate["choices"]
>[number]["choice"];

/** A template's labelled sub-choices, e.g. `{ label: "Skill Proficiencies", choice }`. */
type LabeledChoices = { choices?: { label: string; choice: ChoiceDetail }[] };

/** The form's selected-choices map: choice key -> one or many reference keys. */
export type SelectedChoices = Record<string, string | string[]>;

/** A display value plus where it came from (the class/species/background name). */
export interface LabeledItem {
  value: string;
  origin?: string;
}

/** One choice block paired with the source it belongs to (for origin labels). */
export interface ChoiceSource {
  choice: ChoiceDetail | null;
  origin: string | undefined;
}

/** Coerce a single value or array into an array (empty when undefined). */
export function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Find a template's choice block by its label, if present. */
export function findChoiceByLabel(
  template: LabeledChoices | null,
  label: string,
): ChoiceDetail | undefined {
  return template?.choices?.find((entry) => entry.label === label)?.choice;
}

/** The reference keys the user selected for a labelled choice (empty if none). */
export function resolveSelected(
  template: LabeledChoices | null,
  label: string,
  choices: SelectedChoices,
): string[] {
  const choice = findChoiceByLabel(template, label);
  return choice ? asArray(choices[choice.id.value]) : [];
}

/** Map every option's reference key to the option type it belongs to. */
export function indexChoiceTypes(
  details: ChoiceDetail[],
): Record<string, string> {
  const typeByKey: Record<string, string> = {};
  for (const detail of details) {
    for (const group of detail.choiceGroups) {
      for (const content of group.groupContents) {
        typeByKey[content.referenceKey] = content.type;
      }
    }
  }
  return typeByKey;
}

/**
 * Group the reference keys the user actually chose, keyed by their option type
 * (e.g. "SkillProficiency", "Feat", "WeaponMastery"). Each chosen key is paired
 * with the source it came from so the UI can show "(Class name)" origins.
 *
 * `defaultType` is used when an option carries no type in the template — the
 * proficiencies panel treats those as feats, the payload builder as unknown.
 */
export function bucketChosenByType(
  sources: ChoiceSource[],
  choices: SelectedChoices,
  defaultType: string,
): Record<string, LabeledItem[]> {
  const result: Record<string, LabeledItem[]> = {};
  for (const { choice, origin } of sources) {
    if (!choice) continue;
    const chosen = asArray(choices[choice.id.value]);
    if (!chosen.length) continue;

    const typeByKey = indexChoiceTypes([choice]);
    for (const referenceKey of chosen) {
      const type = typeByKey[referenceKey] ?? defaultType;
      (result[type] ??= []).push({
        value: formatReferenceKey(referenceKey),
        origin,
      });
    }
  }
  return result;
}

/**
 * The reference keys inside the equipment bundle the user picked, if any.
 * Starting equipment is a "pick one bundle" choice: the selected value is a
 * group id, and we want the items inside that group (used to derive AC).
 */
export function resolveChosenEquipmentKeys(
  template: LabeledChoices | null,
  choices: SelectedChoices,
): string[] | undefined {
  const choice = findChoiceByLabel(template, FEATURE_LABELS.STARTING_EQUIPMENT);
  if (!choice) return undefined;
  const chosenGroupId = asArray(choices[choice.id.value])[0];
  if (!chosenGroupId) return undefined;
  return choice.choiceGroups
    .find((group) => group.id.value === chosenGroupId)
    ?.groupContents.map((content) => content.referenceKey);
}
