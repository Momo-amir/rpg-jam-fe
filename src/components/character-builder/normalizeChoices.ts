import type { ActiveChoice, NamedItem, EquipmentOption, FlatItem } from "@/models/types/character-builder.types";

const CHOICE_LABELS: Record<string, string> = {
  skillProficiencies: "Skills",
  startingEquipment: "Starting Equipment",
  toolProficiency: "Tool Proficiency",
  size: "Size",
};

function isNamedItem(value: unknown): value is NamedItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    "numberOfChoices" in value &&
    "options" in value
  );
}

function isFlatItem(value: unknown): value is FlatItem {
  return (
    typeof value === "object" &&
    value !== null &&
    "numberOfChoices" in value &&
    "options" in value &&
    Array.isArray((value as FlatItem).options)
  );
}

function flatOptionToItem(option: string | EquipmentOption): { id: string; name: string; tags?: string[] } {
  if (typeof option === "string") {
    return { id: option, name: option };
  }
  return {
    id: option.label,
    name: `Option ${option.label}`,
    ...(option.optionGroup && { tags: option.optionGroup }),
  };
}

const NAMED_KEYS = ["classFeatures", "specialTraits"] as const;

export function normalizeChoices(template: {
  choices?: Record<string, unknown>[];
}): ActiveChoice[] {
  return (template.choices ?? []).flatMap((group) => {
    const namedChoices = NAMED_KEYS.flatMap((key) => {
      const items = group[key];
      if (!Array.isArray(items)) return [];
      return items
        .filter(
          (item): item is NamedItem =>
            isNamedItem(item) &&
            item.numberOfChoices > 0 &&
            item.options.length > 0,
        )
        .map((item) => ({
          key: item.id ?? item.name,
          title: item.name,
          description: item.description,
          numberOfChoices: item.numberOfChoices,
          options: item.options.map((option) => ({ id: option, name: option })),
        }));
    });

    const flatChoices = Object.entries(group)
      .filter(
        ([key, value]) =>
          !NAMED_KEYS.includes(key as (typeof NAMED_KEYS)[number]) &&
          isFlatItem(value) &&
          (value as FlatItem).numberOfChoices > 0 &&
          (value as FlatItem).options.length > 0,
      )
      .map(([key, value]) => {
        const flat = value as FlatItem;
        return {
          key,
          title: CHOICE_LABELS[key] ?? key,
          numberOfChoices: flat.numberOfChoices,
          options: flat.options.map(flatOptionToItem),
        };
      });

    return [...namedChoices, ...flatChoices];
  });
}
