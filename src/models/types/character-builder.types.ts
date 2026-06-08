import type { StaticImageData } from "next/image";
import type { z } from "zod";
import type {
  characterBuilderSchema,
  abilityScoresSchema,
  classTemplateSchema,
  classChoiceSchema,
  skillChoiceSchema,
} from "@/models/schemas/character-builder";

// ─── Form types ───────────────────────────────────────────────────────────────

export type CharacterBuilderFormValues = z.infer<typeof characterBuilderSchema>;
export type AbilityScores = z.infer<typeof abilityScoresSchema>;

// ─── API response types ───────────────────────────────────────────────────────

export type ClassTemplate = z.infer<typeof classTemplateSchema>;
export type ClassChoice = z.infer<typeof classChoiceSchema>;
export type SkillChoice = z.infer<typeof skillChoiceSchema>;

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

// ─── UI option shape ──────────────────────────────────────────────────────────

export interface OptionItem {
  id: string;
  name: string;
  description: string;
  tags?: string[];
  image?: string;
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

