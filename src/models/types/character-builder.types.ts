import type { StaticImageData } from "next/image";
import type { z } from "zod";
import type {
  characterBuilderSchema,
  abilityScoresSchema,
  classTemplateSchema,
  classListItemSchema,
  classChoiceSchema,
  skillChoiceSchema,
  speciesTemplateSchema,
  backgroundTemplateSchema,
} from "@/models/schemas/character-builder";

// ─── Form types ───────────────────────────────────────────────────────────────

export type CharacterBuilderFormValues = z.infer<typeof characterBuilderSchema>;
export type AbilityScores = z.infer<typeof abilityScoresSchema>;

// ─── API response types ───────────────────────────────────────────────────────

export type ClassTemplate = z.infer<typeof classTemplateSchema>;
export type ClassListItem = z.infer<typeof classListItemSchema>;
export type ClassChoice = z.infer<typeof classChoiceSchema>;
export type SkillChoice = z.infer<typeof skillChoiceSchema>;
export type SpeciesTemplate = z.infer<typeof speciesTemplateSchema>;
export type BackgroundTemplate = z.infer<typeof backgroundTemplateSchema>;

// ─── Form field keys ─────────────────────────────────────────────────────────

export type CharacterCreatorChoice =
  | "class"
  | "species"
  | "background"
  | "ability-scores"
  | "proficiencies"
  | "ac"
  | "hp"
  | "alignment"
  | "portrait"
  | "name";

// ─── Choice normalizer types ──────────────────────────────────────────────────

export interface ActiveChoice {
  key: string;
  title: string;
  description?: string;
  numberOfChoices: number;
  options: { id: string; name: string; tags?: string[] }[];
}

export type NamedItem = {
  id?: string;
  name: string;
  numberOfChoices: number;
  options: string[];
  description?: string;
};

export type EquipmentOption = { label: string; optionGroup?: string[] };

export type FlatItem = {
  numberOfChoices: number;
  options: (string | EquipmentOption)[];
};

// ─── UI option shape ──────────────────────────────────────────────────────────

export interface OptionItem {
  id: string;
  name: string;
  description?: string;
  tags?: string | string[];
  image?: string | StaticImageData;
}

// ─── Character builder section config ────────────────────────────────────────

export type CharacterSectionKey = "class" | "species" | "background";

export interface CharacterSectionConfig {
  key: CharacterSectionKey;
  label: string;
  description: string;
  modalTitle: string;
  icon: React.ReactNode;
  placeholderImage: StaticImageData;
}
