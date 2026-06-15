import { useEffect, useState } from "react";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import {
  abilityModifier,
  deriveAc,
  deriveMaxHp,
  FEATURE_LABELS,
  normalizeBackgroundChoices,
  normalizeClassChoices,
  normalizeSpeciesChoices,
} from "@/utils/character";
import {
  fetchClasses,
  fetchSpecies,
  fetchSpeciesByKey,
  fetchBackgrounds,
  fetchBackground,
  fetchClass,
} from "@/utils/api/character-options";
import {
  CHARACTER_SECTIONS,
  FIELD_BY_KEY,
  mapClass,
  mapSpecies,
  mapBackground,
} from "./character-sections.config";
import type {
  ActiveChoice,
  CharacterBuilderFormValues as FormValues,
  ClassListItem,
  ClassTemplate,
  SpeciesListItem,
  SpeciesTemplate,
  BackgroundListItem,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

type OptionList = ReturnType<typeof mapClass>[];

export interface BuilderSection {
  key: "class" | "species" | "background";
  label: string;
  description: string;
  modalTitle: string;
  icon: React.ReactNode;
  placeholderImage: (typeof CHARACTER_SECTIONS)[number]["placeholderImage"];
  list: OptionList;
  selectedId: string;
  selectedName?: string;
  selectedImage?: OptionList[number]["image"];
  field: (typeof FIELD_BY_KEY)[keyof typeof FIELD_BY_KEY];
  choices: ActiveChoice[];
}

export interface CharacterBuilderState {
  classTemplate: ClassTemplate | null;
  speciesTemplate: SpeciesTemplate | null;
  backgroundTemplate: BackgroundTemplate | null;
  sections: BuilderSection[];
  allChoices: ActiveChoice[];
  hasIncompleteChoices: boolean;
  derivedHp: number | null;
  derivedAc: number;
}

export function useCharacterBuilder(
  control: Control<FormValues>,
  setValue: UseFormSetValue<FormValues>,
): CharacterBuilderState {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [species, setSpecies] = useState<SpeciesListItem[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundListItem[]>([]);
  const [classTemplate, setClassTemplate] = useState<ClassTemplate | null>(
    null,
  );
  const [speciesTemplate, setSpeciesTemplate] =
    useState<SpeciesTemplate | null>(null);
  const [backgroundTemplate, setBackgroundTemplate] =
    useState<BackgroundTemplate | null>(null);

  useEffect(() => {
    fetchClasses().then(setClasses).catch(console.error);
    fetchSpecies().then(setSpecies).catch(console.error);
    fetchBackgrounds().then(setBackgrounds).catch(console.error);
  }, []);

  const [classId, speciesId, backgroundId] = useWatch({
    control,
    name: ["classId", "speciesId", "backgroundId"],
  });
  const choices = useWatch({ control, name: "choices" });
  const abilityScores = useWatch({ control, name: "abilityScores" });

  useEffect(() => {
    if (!classId) return;
    fetchClass(classId).then(setClassTemplate);
  }, [classId]);

  useEffect(() => {
    if (!speciesId) return;
    fetchSpeciesByKey(speciesId).then(setSpeciesTemplate);
  }, [speciesId]);

  useEffect(() => {
    if (!backgroundId) return;
    fetchBackground(backgroundId).then(setBackgroundTemplate);
  }, [backgroundId]);

  useEffect(() => {
    const prefillable = [
      ...normalizeClassChoices(classTemplate),
      ...normalizeSpeciesChoices(speciesTemplate),
      ...normalizeBackgroundChoices(backgroundTemplate),
    ];
    for (const choice of prefillable) {
      if (choice.prefilledValue !== undefined) {
        setValue(`choices.${choice.key}`, choice.prefilledValue, {
          shouldValidate: true,
        });
      }
    }
  }, [classTemplate, speciesTemplate, backgroundTemplate, setValue]);

  const choicesByKey: Record<BuilderSection["key"], ActiveChoice[]> = {
    class: normalizeClassChoices(classTemplate),
    species: normalizeSpeciesChoices(speciesTemplate),
    background: normalizeBackgroundChoices(backgroundTemplate),
  };
  const selectedIdByKey: Record<BuilderSection["key"], string> = {
    class: classId ?? "",
    species: speciesId ?? "",
    background: backgroundId ?? "",
  };
  const listByKey: Record<BuilderSection["key"], OptionList> = {
    class: classes.map(mapClass),
    species: species.map(mapSpecies),
    background: backgrounds.map(mapBackground),
  };

  const sections: BuilderSection[] = CHARACTER_SECTIONS.map((section) => {
    const list = listByKey[section.key];
    const selectedId = selectedIdByKey[section.key];
    const selected = list.find((item) => item.id === selectedId);
    return {
      ...section,
      list,
      selectedId,
      selectedName: selected?.name,
      selectedImage: selected?.image,
      field: FIELD_BY_KEY[section.key],
      choices: choicesByKey[section.key],
    };
  });

  const allChoices = sections.flatMap((section) => section.choices);
  const hasIncompleteChoices = allChoices.some((choice) => {
    const value = choices?.[choice.key];
    const count = Array.isArray(value) ? value.length : value ? 1 : 0;
    return count < choice.numberOfChoices;
  });

  const dexMod = abilityModifier(abilityScores?.dexterity ?? 10);

  const derivedHp = classTemplate
    ? deriveMaxHp(classTemplate.hitDie, abilityScores?.constitution ?? 10)
    : null;

  const startingEquipmentChoice = classTemplate?.choices?.find(
    (classChoice) => classChoice.label === FEATURE_LABELS.STARTING_EQUIPMENT,
  );
  const chosenGroupId = startingEquipmentChoice
    ? (choices?.[startingEquipmentChoice.choice.id.value] as string | undefined)
    : undefined;
  const chosenEquipmentItems = chosenGroupId
    ? startingEquipmentChoice?.choice.choiceGroups
        .find((group) => group.id.value === chosenGroupId)
        ?.groupContents.map((content) => content.referenceKey)
    : undefined;

  const derivedAc = deriveAc(
    classTemplate?.armorTraining ?? [],
    dexMod,
    chosenEquipmentItems,
  );

  return {
    classTemplate,
    speciesTemplate,
    backgroundTemplate,
    sections,
    allChoices,
    hasIncompleteChoices,
    derivedHp,
    derivedAc,
  };
}
