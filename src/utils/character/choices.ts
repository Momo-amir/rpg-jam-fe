import { FEATURE_LABELS } from "./feature-labels";
import { formatReferenceKey } from "./stats";
import type { ClassTemplate } from "@/types/character";

export type ChoiceDetail = NonNullable<
  ClassTemplate["choices"]
>[number]["choice"];

type LabeledChoices = { choices?: { label: string; choice: ChoiceDetail }[] };

export type SelectedChoices = Record<string, string | string[]>;

export interface LabeledItem {
  value: string;
  origin?: string;
}

export interface ChoiceSource {
  choice: ChoiceDetail | null;
  origin: string | undefined;
}

export function asArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function findChoiceByLabel(
  template: LabeledChoices | null,
  label: string,
): ChoiceDetail | undefined {
  return template?.choices?.find((entry) => entry.label === label)?.choice;
}

export function resolveSelected(
  template: LabeledChoices | null,
  label: string,
  choices: SelectedChoices,
): string[] {
  const choice = findChoiceByLabel(template, label);
  return choice ? asArray(choices[choice.id.value]) : [];
}

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
Group the reference keys the user actually chose, keyed by their option type
(example "SkillProficiency", "Feat", "WeaponMastery"). Each chosen key is paired
with the source it came from so the UI can show "(Class name)" origins.
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
