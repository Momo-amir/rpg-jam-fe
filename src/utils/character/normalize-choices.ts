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

// the main normalization function the 3 templates use
// it turns the variation of choice structures from the API into a predictable shape ;) .

// For the team: ActiveChoice is the shape the UI form expects for all the choices regardless of origin
// So we need to flatten them and map them into that, the only big variations is to handle the times where we need bundled options like Starting Equipment
// Read up on it in the docs directory, look up flatMap in JS Docs, or ask me
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
  // This just makes it so if we dont have a active choice that we still give the API the value by pre-filling it.
  const prefilledValue =
    choice.numberOfChoices === 0
      ? options.length === 1
        ? options[0].id
        : options.map((option) => option.id)
      : options.length === choice.numberOfChoices
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
  // Fixed grants (numberOfChoices === 0) stay in the list so the prefill effect
  // writes their always-taken options into the form; ChoiceTags hides them.
  return (choices ?? []).map(({ label, choice }) =>
    normalizeChoiceDetail(label, choice),
  );
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

// Could be unified with species, but this is for clarity and future flexibility, since either may eventually have a unique choice structure.

export function normalizeBackgroundChoices(
  template: BackgroundTemplate | null,
): ActiveChoice[] {
  return normalizeChoiceList(template?.choices);
}
