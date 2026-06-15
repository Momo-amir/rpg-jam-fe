import { Sword, User, BookOpen } from "lucide-react";

import type {
  CharacterSectionConfig,
  ClassListItem,
  SpeciesListItem as SpeciesTemplate,
  BackgroundListItem,
} from "@/models/types/character-builder.types";
import {
  classImages,
  speciesImages,
  backgroundImages,
} from "@/utils/api/character-images";
import bardImage from "@/public/assets/bard.png";
import humanImage from "@/public/assets/human.png";
import soldierImage from "@/public/assets/soldier.png";

export const FIELD_BY_KEY = {
  class: "classId",
  species: "speciesId",
  background: "backgroundId",
} as const;

export function mapClass(playableClass: ClassListItem) {
  return {
    id: playableClass.key,
    name: playableClass.name,
    description: playableClass.description,
    image: classImages[playableClass.key.replace("-template", "")],
    tags: [
      ...(playableClass.hitDie ? [`Hitdie: ${playableClass.hitDie}`] : []),
      ...(playableClass.primaryAbilities ?? []),
      ...(playableClass.armorTraining ?? []),
    ],
  };
}

export function mapSpecies(playableSpecies: SpeciesTemplate) {
  return {
    id: playableSpecies.key,
    name: playableSpecies.name,
    description: playableSpecies.creatureType ?? "",
    image: speciesImages[playableSpecies.key],
    tags: playableSpecies.traits ?? [],
  };
}

export function mapBackground(background: BackgroundListItem) {
  return {
    id: background.key,
    name: background.name,
    description: background.description ?? "",
    tags: [
      ...(background.feat ? [background.feat] : []),
      ...(background.skillProficiencies ?? []),
    ],
    image: backgroundImages[background.key],
  };
}

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
