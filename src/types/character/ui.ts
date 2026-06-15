import type { StaticImageData } from "next/image";
import type { LucideIcon } from "lucide-react";

// Hand-written UI types (not derived from a schema — they describe shapes the
// frontend constructs, not API responses).

// A normalized, render-ready choice (see utils/character/normalize-choices.ts).
export interface ActiveChoice {
  key: string;
  title: string;
  description?: string;
  numberOfChoices: number;
  prefilledValue?: string | string[];
  options: { id: string; name: string; tags?: string[] }[];
}

// A single selectable option as rendered in the selection modal.
export interface OptionItem {
  id: string;
  name: string;
  description?: string;
  tags?: string | string[];
  image?: string | StaticImageData;
}

// Static metadata for the three main selection sections.
export interface CharacterSectionConfig {
  key: "class" | "species" | "background";
  label: string;
  description: string;
  modalTitle: string;
  /** Lucide icon component — the consumer renders it, e.g. `<section.icon size={20} />`. */
  icon: LucideIcon;
  placeholderImage: StaticImageData;
}
