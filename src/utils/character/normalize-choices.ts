import type {
  ActiveChoice,
  BackgroundTemplate,
  ClassTemplate,
  SpeciesTemplate,
} from "@/types/character";
import { speciesImages } from "@/utils/api/character-images";
import { formatReferenceKey } from "./stats";
import { FEATURE_LABEL_OVERRIDES } from "./feature-labels";
import type { ChoiceDetail } from "./choices";

function toDisplayLabel(label: string): string {
  return FEATURE_LABEL_OVERRIDES[label] ?? label;
}

function normalizeChoiceDetail(
  label: string,
  choice: ChoiceDetail,
  description?: string,
): ActiveChoice {
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
          ...(speciesImages[content.referenceKey] && {
            image: speciesImages[content.referenceKey],
          }),
        })),
      );

  const prefilledValue =
    options.length === choice.numberOfChoices
      ? choice.numberOfChoices === 1
        ? options[0].id
        : options.map((option) => option.id)
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

// All three templates expose sub-choices as a unified `choices: { label, choice }[]`
// array. Class additionally carries per-feature choices in `classFeatures`.
function normalizeChoiceList(
  choices: { label: string; choice: ChoiceDetail }[] | undefined,
): ActiveChoice[] {
  return (choices ?? []).flatMap(({ label, choice }) => {
    if (choice.numberOfChoices === 0) return [];
    return [normalizeChoiceDetail(label, choice)];
  });
}

export function normalizeClassChoices(
  template: ClassTemplate | null,
): ActiveChoice[] {
  if (!template) return [];
  const featureChoices = (template.classFeatures ?? [])
    .filter((feature) => feature.choice !== undefined)
    .map((feature) =>
      normalizeChoiceDetail(feature.name, feature.choice!, feature.description),
    );
  return [...featureChoices, ...normalizeChoiceList(template.choices)];
}

export function normalizeSpeciesChoices(
  template: SpeciesTemplate | null,
): ActiveChoice[] {
  return normalizeChoiceList(template?.choices);
}

export function normalizeBackgroundChoices(
  template: BackgroundTemplate | null,
): ActiveChoice[] {
  return normalizeChoiceList(template?.choices);
}
