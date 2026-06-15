import type { ClassTemplate } from "@/models/types/character-builder.types";

/** A single choice's detail block, shared by class/species/background templates. */
export type ChoiceDetail = NonNullable<
  ClassTemplate["choices"]
>[number]["choice"];

/** A template's labelled sub-choices, e.g. `{ label: "Skill Proficiencies", choice }`. */
type LabeledChoices = { choices?: { label: string; choice: ChoiceDetail }[] };

/** The form's selected-choices map: choice key -> one or many reference keys. */
export type SelectedChoices = Record<string, string | string[]>;

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
