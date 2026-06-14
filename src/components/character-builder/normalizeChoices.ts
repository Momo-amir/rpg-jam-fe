import type { ActiveChoice, ClassTemplate, SpeciesTemplate } from "@/models/types/character-builder.types";
import { formatReferenceKey } from "@/utils/character";

type ChoiceDetail = NonNullable<NonNullable<ClassTemplate["classFeatures"]>[number]["choice"]>;

function normalizeChoiceDetail(label: string, choice: ChoiceDetail): ActiveChoice {
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
        })),
      );

  return {
    key: choice.id.value,
    title: label,
    numberOfChoices: choice.numberOfChoices,
    options,
  };
}

export function normalizeClassChoices(classTemplate: ClassTemplate): ActiveChoice[] {
  const featureChoices = (classTemplate.classFeatures ?? [])
    .filter((feature) => feature.choice !== null)
    .map((feature) => normalizeChoiceDetail(feature.name, feature.choice!));

  const classChoices = (classTemplate.choices ?? []).map(({ label, choice }) =>
    normalizeChoiceDetail(label, choice),
  );

  return [...featureChoices, ...classChoices];
}

export function normalizeSpeciesChoices(speciesTemplate: SpeciesTemplate): ActiveChoice[] {
  return (speciesTemplate.choices ?? []).map(({ label, choice }) =>
    normalizeChoiceDetail(label, choice),
  );
}

