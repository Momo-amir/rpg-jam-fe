import { Sword, User, BookOpen } from "lucide-react";

import type { CharacterSectionConfig } from "@/models/types/character-builder.types";
import bardImage from "@/public/assets/bard.png";
import humanImage from "@/public/assets/human.png";
import soldierImage from "@/public/assets/soldier.png";

export const CHARACTER_SECTIONS: CharacterSectionConfig[] = [
  {
    key: "class",
    label: "Class",
    description: "Your vocation, special talents, and favored tactics.",
    modalTitle: "Choose a Class",
    icon: <Sword size={20} />,
    placeholderImage: bardImage,
  },
  {
    key: "species",
    label: "Species",
    description: "Your ancestry and innate traits.",
    modalTitle: "Choose a Species",
    icon: <User size={20} />,
    placeholderImage: humanImage,
  },
  {
    key: "background",
    label: "Background",
    description: "How you spent your years before adventure.",
    modalTitle: "Choose a Background",
    icon: <BookOpen size={20} />,
    placeholderImage: soldierImage,
  },
];

