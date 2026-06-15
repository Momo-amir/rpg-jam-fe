import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";
import type { z } from "zod";
import type {
  characterBuilderSchema,
  createCharacterPayloadSchema,
  characterSchema,
  classTemplateSchema,
  classListItemSchema,
  speciesListItemSchema,
  speciesTemplateSchema,
  backgroundListItemSchema,
  backgroundTemplateSchema,
} from "@/models/schemas/character-builder";

// ─── Form types ───────────────────────────────────────────────────────────────

export type CharacterBuilderFormValues = z.infer<typeof characterBuilderSchema>;
export type CreateCharacterPayload = z.infer<typeof createCharacterPayloadSchema>;
export type Character = z.infer<typeof characterSchema>;

// ─── API response types ───────────────────────────────────────────────────────

export type ClassTemplate = z.infer<typeof classTemplateSchema>;
export type ClassListItem = z.infer<typeof classListItemSchema>;
export type SpeciesListItem = z.infer<typeof speciesListItemSchema>;
export type SpeciesTemplate = z.infer<typeof speciesTemplateSchema>;
export type BackgroundListItem = z.infer<typeof backgroundListItemSchema>;
export type BackgroundTemplate = z.infer<typeof backgroundTemplateSchema>;

// ─── Choice normalizer types ──────────────────────────────────────────────────

export interface ActiveChoice {
  key: string;
  title: string;
  description?: string;
  numberOfChoices: number;
  prefilledValue?: string | string[];
  options: { id: string; name: string; tags?: string[] }[];
}

// ─── UI option shape ──────────────────────────────────────────────────────────

export interface OptionItem {
  id: string;
  name: string;
  description?: string;
  tags?: string | string[];
  image?: string | StaticImageData;
}

// ─── Character builder section config ────────────────────────────────────────

export interface CharacterSectionConfig {
  key: "class" | "species" | "background";
  label: string;
  description: string;
  modalTitle: string;
  /** Lucide icon component — the consumer renders it, e.g. `<section.icon size={20} />`. */
  icon: LucideIcon;
  placeholderImage: StaticImageData;
}
