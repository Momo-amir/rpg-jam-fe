import type {
  CharacterBuilderFormValues,
  CreateCharacterPayload,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/types/character";
import { toPascalCase, toPascalCaseList } from "./backend-enums";
import { FEATURE_LABELS } from "./feature-labels";
import {
  asArray,
  findChoiceByLabel,
  indexChoiceTypes,
  resolveSelected,
  type ChoiceDetail,
  type SelectedChoices,
} from "./choices";

interface PayloadContext {
  classTemplate: ClassTemplate | null;
  speciesTemplate: SpeciesTemplate | null;
  backgroundTemplate: BackgroundTemplate | null;
  derivedHp: number | null;
  derivedAc: number;
}

function startingEquipmentItems(
  template: { choices?: { label: string; choice: ChoiceDetail }[] } | null,
  choices: SelectedChoices,
): CreateCharacterPayload["startingEquipment"] {
  const choice = findChoiceByLabel(template, FEATURE_LABELS.STARTING_EQUIPMENT);
  if (!choice) return [];
  const chosenGroupId = asArray(choices[choice.id.value])[0];
  const group = choice.choiceGroups.find(
    (candidate) => candidate.id.value === chosenGroupId,
  );
  return (group?.groupContents ?? []).map((content) => ({
    referenceKey: toPascalCase(content.referenceKey),
    quantity: content.quantity,
    type: content.type,
  }));
}

// All three templates expose sub-choices as a unified `choices: { label, choice }[]`
// array; class additionally carries per-feature choices.
function allChoiceDetails(
  classTemplate: ClassTemplate | null,
  speciesTemplate: SpeciesTemplate | null,
  backgroundTemplate: BackgroundTemplate | null,
): ChoiceDetail[] {
  const featureChoices = (classTemplate?.classFeatures ?? [])
    .map((feature) => feature.choice)
    .filter((choice): choice is ChoiceDetail => choice !== undefined);

  const arrayChoices = [
    ...(classTemplate?.choices ?? []),
    ...(speciesTemplate?.choices ?? []),
    ...(backgroundTemplate?.choices ?? []),
  ].map((entry) => entry.choice);

  return [...featureChoices, ...arrayChoices];
}

export function buildCreateCharacterPayload(
  form: CharacterBuilderFormValues,
  context: PayloadContext,
): CreateCharacterPayload {
  const {
    classTemplate,
    speciesTemplate,
    backgroundTemplate,
    derivedHp,
    derivedAc,
  } = context;
  const choices = form.choices ?? {};

  const typeByKey = indexChoiceTypes(
    allChoiceDetails(classTemplate, speciesTemplate, backgroundTemplate),
  );

  // Bucket every selected reference key by the option type it came from.
  const chosenByType: Record<string, string[]> = {};
  for (const value of Object.values(choices)) {
    for (const referenceKey of asArray(value)) {
      const type = typeByKey[referenceKey] ?? "Unknown";
      (chosenByType[type] ??= []).push(referenceKey);
    }
  }

  const chosenSkills = chosenByType["SkillProficiency"] ?? [];
  // The tool choice's options are typed "Item", so resolve it by label instead.
  const chosenTools = resolveSelected(
    backgroundTemplate,
    FEATURE_LABELS.TOOL_PROFICIENCY,
    choices,
  );

  // Skills: background fixed grants + skills chosen from class/species choices.
  const skills = toPascalCaseList([
    ...(backgroundTemplate?.skillProficiencies ?? []),
    ...chosenSkills,
  ]);

  const proficiencies: CreateCharacterPayload["proficiencies"] = {
    skills: dedupe(skills),
    tools: dedupe(toPascalCaseList(chosenTools)),
    weapons: dedupe(toPascalCaseList(classTemplate?.weaponProficiency ?? [])),
    armors: dedupe(toPascalCaseList(classTemplate?.armorTraining ?? [])),
    // No language choice surfaced in the builder yet.
    languages: [],
  };

  const chosenSize = (chosenByType["Size"] ?? [])[0];

  const byType = (type: string) =>
    dedupe(toPascalCaseList(chosenByType[type] ?? []));
  // Feats come from chosen Feat options (e.g. fighting style) plus the background's
  const feats = dedupe(
    toPascalCaseList([
      ...(backgroundTemplate?.feat ? [backgroundTemplate.feat] : []),
      ...(chosenByType["Feat"] ?? []),
    ]),
  );
  const weaponMasteries = byType("WeaponMastery");
  const cantrips = byType("Cantrip");
  const spells = byType("Spell");

  const classFeatures = toPascalCaseList(
    (classTemplate?.classFeatures ?? []).map((feature) => feature.name),
  );

  const hitDie = classTemplate?.hitDie ?? "D6";

  const startingEquipment = [
    ...startingEquipmentItems(classTemplate, choices),
    ...startingEquipmentItems(backgroundTemplate, choices),
  ];

  return {
    level: 1,
    details: {
      name: form.name,
      pronouns: form.pronouns ?? "",
      alignment: form.alignment ?? "",
      backstory: form.backstory ?? "",
      appearance: form.appearance ?? "",
      personality: form.personality ?? "",
    },
    hitPoints: {
      max: derivedHp ?? 0,
      hitDice: hitDie,
    },
    background: backgroundTemplate?.name ?? "",
    class: {
      type: classTemplate?.name ?? "",
    },
    speciesTraits: {
      speciesType: speciesTemplate ? toPascalCase(speciesTemplate.name) : "",
      creatureType: speciesTemplate?.creatureType ?? "",
      size: chosenSize ? toPascalCase(chosenSize) : "",
      speed: speciesTemplate?.speed ?? 0,
    },
    abilities: {
      strength: form.abilityScores.strength,
      dexterity: form.abilityScores.dexterity,
      constitution: form.abilityScores.constitution,
      intelligence: form.abilityScores.intelligence,
      wisdom: form.abilityScores.wisdom,
      charisma: form.abilityScores.charisma,
    },
    proficiencies,
    classFeatures,
    feats,
    armorClass: derivedAc,
    startingEquipment,
    ...(weaponMasteries.length && { weaponMasteries }),
    ...(cantrips.length && { cantrips }),
    ...(spells.length && { spells }),
  };
}

// Dedupe an array of strings while preserving order. Assumes values are already
// transformed to PascalCase, so simple Set-based deduping is sufficient.
function dedupe(values: string[]): string[] {
  return [...new Set(values)];
}
