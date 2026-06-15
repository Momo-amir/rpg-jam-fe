import type {
  ClassListItem,
  SpeciesListItem,
  BackgroundListItem,
} from "@/models/types/character-builder.types";
import {
  classImages,
  speciesImages,
  backgroundImages,
} from "@/utils/api/character-images";
import { formatReferenceKey } from "./stats";

// These turn a lightweight API list item (id + name + a few fields) into the
// `OptionItem` shape the selection modal renders: id, name, description, image, tags.

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

export function mapSpecies(playableSpecies: SpeciesListItem) {
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
      ...(background.feat ? [formatReferenceKey(background.feat)] : []),
      ...(background.skillProficiencies ?? []),
    ],
    image: backgroundImages[background.key],
  };
}
