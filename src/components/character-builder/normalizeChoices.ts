import type { ActiveChoice, BackgroundTemplate, ClassTemplate, SpeciesTemplate } from "@/models/types/character-builder.types";
import { speciesImages } from "@/utils/api/character-images";
import { formatReferenceKey } from "@/utils/character";
import { FEATURE_LABEL_OVERRIDES } from "./feature-labels";

type ChoiceDetail = NonNullable<ClassTemplate["choices"]>[number]["choice"];

function toDisplayLabel(label: string): string {
  return FEATURE_LABEL_OVERRIDES[label] ?? label;
}

function normalizeChoiceDetail(label: string, choice: ChoiceDetail, description?: string): ActiveChoice {
  const isBundled = choice.choiceGroups.length > 1;

  const options = isBundled
    ? choice.choiceGroups.map((group) => ({
        id: group.id.value,
        name: `Option ${group.label}`,
        tags: group.groupContents.map((content) =>
          content.quantity > 1
            ? `${content.quantity}x ${formatReferenceKey(content.referenceKey)}`
            : formatReferenceKey(content.referenceKey),
        ),
      }))
    : choice.choiceGroups.flatMap((group) =>
        group.groupContents.map((content) => ({
          id: content.referenceKey,
          name: formatReferenceKey(content.referenceKey),
          tags: [content.type],
          ...(speciesImages[content.referenceKey] && { image: speciesImages[content.referenceKey] }),
        })),
      );

  const prefilledValue =
    options.length === choice.numberOfChoices
      ? choice.numberOfChoices === 1
        ? options[0].id
        : options.map((o) => o.id)
      : undefined;

  return {
    key: choice.id.value,
    title: toDisplayLabel(label),
    numberOfChoices: choice.numberOfChoices,
    options,
    ...(prefilledValue !== undefined && { prefilledValue }),
    ...(description && { description }),
  };
}

export function normalizeClassChoices(classTemplate: ClassTemplate): ActiveChoice[] {
  const featureChoices = (classTemplate.classFeatures ?? [])
    .filter((feature) => feature.choice !== undefined)
    .map((feature) => normalizeChoiceDetail(feature.name, feature.choice!, feature.description));

  const classChoices = (classTemplate.choices ?? []).map(({ label, choice }) =>
    normalizeChoiceDetail(label, choice),
  );

  return [...featureChoices, ...classChoices];
}

const SPECIES_CHOICE_FIELDS: { key: keyof SpeciesTemplate; label: string }[] = [
  { key: "size", label: "Size" },
  { key: "lineage", label: "Lineage" },
  { key: "skillful", label: "Skillful" },
  { key: "versatile", label: "Versatile" },
];

export function normalizeSpeciesChoices(speciesTemplate: SpeciesTemplate): ActiveChoice[] {
  return SPECIES_CHOICE_FIELDS.flatMap(({ key, label }) => {
    const choice = speciesTemplate[key] as Parameters<typeof normalizeChoiceDetail>[1] | null | undefined;
    if (!choice || choice.numberOfChoices === 0) return [];
    return [normalizeChoiceDetail(label, choice)];
  });
}

const BACKGROUND_CHOICE_FIELDS: { key: keyof BackgroundTemplate; label: string }[] = [
  { key: "ability", label: "Ability Score Improvement" },
  { key: "toolProficiencies", label: "Tool Proficiency" },
  { key: "startingEquipment", label: "Starting Equipment" },
];

export function normalizeBackgroundChoices(backgroundTemplate: BackgroundTemplate): ActiveChoice[] {
  return BACKGROUND_CHOICE_FIELDS.flatMap(({ key, label }) => {
    const choice = backgroundTemplate[key] as Parameters<typeof normalizeChoiceDetail>[1] | null | undefined;
    if (!choice || choice.numberOfChoices === 0) return [];
    return [normalizeChoiceDetail(label, choice)];
  });
}
