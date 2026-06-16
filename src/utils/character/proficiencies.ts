import type {
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/types/character";
import {
  asArray,
  bucketChosenByType,
  resolveSelected,
  type LabeledItem,
  type SelectedChoices,
} from "./choices";
import { FEATURE_LABELS } from "./feature-labels";
import { formatReferenceKey } from "./stats";

// This file aggregates all the character's proficiencies (skills, armor, weapons, feats, traits) into a single list for display on the character sheet in ther respective box. The
// proficiencies come from a mix of the class/species/background templates and
// the choices the user made when picking those templates.

// Basically this stupid game has the same skills, feats, etc. show up in a million different places in the API (class features, species traits, background proficiencies, choice options)
// and this file is responsible for gathering them all together and deduping them so the character sheet can just render one list of "skills I have"

// Species traits whose presence grants a further skill/feat choice rather
// being a passive trait. They're surfaced through the choices map, not as traits.

const SKILL_GRANT_TRAITS = ["Skillful"];
const FEAT_GRANT_TRAITS = ["Versatile"];

export interface AggregatedProficiencies {
  skills: LabeledItem[];
  armorAndWeapons: LabeledItem[];
  featsAndTraits: LabeledItem[];
}

export function aggregateProficiencies(
  classTemplate: ClassTemplate | null,
  speciesTemplate: SpeciesTemplate | null,
  backgroundTemplate: BackgroundTemplate | null,
  choices: SelectedChoices,
): AggregatedProficiencies {
  // Choices the user made on the class and species, grouped by option type.
  const fromClassFeatures = bucketChosenByType(
    (classTemplate?.classFeatures ?? []).map((feature) => ({
      choice: feature.choice ?? null,
      origin: classTemplate?.name,
    })),
    choices,
    "Feat",
  );
  const fromSpecies = bucketChosenByType(
    (speciesTemplate?.choices ?? []).map((entry) => ({
      choice: entry.choice,
      origin: speciesTemplate?.name,
    })),
    choices,
    "Feat",
  );

  //  Skills
  const backgroundSkills: LabeledItem[] = (
    backgroundTemplate?.skillProficiencies ?? []
  ).map((skill) => ({ value: skill, origin: backgroundTemplate?.name }));

  const classChosenSkills: LabeledItem[] = resolveSelected(
    classTemplate,
    FEATURE_LABELS.SKILL_PROFICIENCIES,
    choices,
  ).map((referenceKey) => ({
    value: formatReferenceKey(referenceKey),
    origin: classTemplate?.name,
  }));

  const traitGrantedSkills: LabeledItem[] = SKILL_GRANT_TRAITS.flatMap(
    (traitName) =>
      asArray(choices[traitName]).map((skill) => ({
        value: skill,
        origin: traitName,
      })),
  );

  const savingThrowItems: LabeledItem[] = (
    classTemplate?.savingThrow ?? []
  ).map((save) => ({ value: `${save} Save`, origin: classTemplate?.name }));

  const skills = dedupeByValue([
    ...backgroundSkills,
    ...classChosenSkills,
    ...(fromClassFeatures["SkillProficiency"] ?? []),
    ...(fromSpecies["SkillProficiency"] ?? []),
    ...traitGrantedSkills,
    ...savingThrowItems,
  ]);

  //  Armor & Weapons
  const armorItems: LabeledItem[] = (classTemplate?.armorTraining ?? []).map(
    (armor) => ({ value: armor }),
  );
  const weaponItems: LabeledItem[] = (
    classTemplate?.weaponProficiency ?? []
  ).map((weapon) => ({ value: weapon }));

  const armorAndWeapons = [
    ...armorItems,
    ...weaponItems,
    ...(fromClassFeatures["WeaponMastery"] ?? []),
  ];

  // Feats & Traits
  const backgroundFeat: LabeledItem[] = backgroundTemplate?.feat
    ? [{ value: formatReferenceKey(backgroundTemplate.feat) }]
    : [];

  // Show only the chosen tool, not all options. Empty until picked
  const toolItems: LabeledItem[] = resolveSelected(
    backgroundTemplate,
    FEATURE_LABELS.TOOL_PROFICIENCY,
    choices,
  ).map((tool) => ({ value: formatReferenceKey(tool) }));

  const passiveTraits: LabeledItem[] = (speciesTemplate?.traits ?? [])
    .filter(
      (trait) =>
        !SKILL_GRANT_TRAITS.includes(trait) &&
        !FEAT_GRANT_TRAITS.includes(trait),
    )
    .map((trait) => ({ value: formatReferenceKey(trait) }));

  const featsAndTraits = [
    ...backgroundFeat,
    ...(fromClassFeatures["Feat"] ?? []),
    ...(fromSpecies["Feat"] ?? []),
    ...toolItems,
    ...passiveTraits,
  ];

  return { skills, armorAndWeapons, featsAndTraits };
}

function dedupeByValue(items: LabeledItem[]): LabeledItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    if (seen.has(item.value)) return false;
    seen.add(item.value);
    return true;
  });
}
