import { Sword, User, BookOpen } from "lucide-react";

import type { CharacterSectionConfig } from "@/types/character";
import bardImage from "@/public/assets/bard.png";
import humanImage from "@/public/assets/human.png";
import soldierImage from "@/public/assets/soldier.png";

// Maps each section's UI key to the form field that stores the chosen id.
export const FIELD_BY_KEY = {
  class: "classId",
  species: "speciesId",
  background: "backgroundId",
} as const;

// Static metadata for the three main selection sections. `icon` is the Lucide
// component itself; the consumer renders it so this stays a plain .ts file.
export const CHARACTER_SECTIONS: CharacterSectionConfig[] = [
  {
    key: "class",
    label: "Class",
    description: "Your vocation, special talents, and favored tactics.",
    modalTitle: "Choose a Class",
    icon: Sword,
    placeholderImage: bardImage,
  },
  {
    key: "species",
    label: "Species",
    description: "Your ancestry and innate traits.",
    modalTitle: "Choose a Species",
    icon: User,
    placeholderImage: humanImage,
  },
  {
    key: "background",
    label: "Background",
    description: "How you spent your years before adventure.",
    modalTitle: "Choose a Background",
    icon: BookOpen,
    placeholderImage: soldierImage,
  },
];
