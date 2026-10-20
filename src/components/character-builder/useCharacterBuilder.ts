import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useWatch, type Control, type UseFormSetValue } from "react-hook-form";
import {
  abilityModifier,
  deriveAc,
  deriveMaxHp,
  mapClass,
  mapSpecies,
  mapBackground,
  normalizeBackgroundChoices,
  normalizeClassChoices,
  normalizeSpeciesChoices,
  resolveChosenEquipmentKeys,
} from "@/utils/character";
import {
  fetchClasses,
  fetchSpecies,
  fetchSpeciesByKey,
  fetchBackgrounds,
  fetchBackground,
  fetchClass,
} from "@/utils/api/character-options";
import { queryKeys } from "@/utils/api/query-keys";
import {
  CHARACTER_SECTIONS,
  FIELD_BY_KEY,
} from "@/components/character-builder/sections.config";
import type {
  ActiveChoice,
  CharacterBuilderFormValues as FormValues,
  CharacterSectionConfig,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/types/character";

type OptionList = ReturnType<typeof mapClass>[];

export interface BuilderSection extends CharacterSectionConfig {
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
  // Reference data never changes while the app runs: fetch once, keep forever.
  const reference = { staleTime: Infinity } as const;
  const { data: classes = [] } = useQuery({ queryKey: queryKeys.classes, queryFn: fetchClasses, ...reference });
  const { data: species = [] } = useQuery({ queryKey: queryKeys.species, queryFn: fetchSpecies, ...reference });
  const { data: backgrounds = [] } = useQuery({ queryKey: queryKeys.backgrounds, queryFn: fetchBackgrounds, ...reference });

  const [classId, speciesId, backgroundId] = useWatch({
    control,
    name: ["classId", "speciesId", "backgroundId"],
  });
  const choices = useWatch({ control, name: "choices" });
  const abilityScores = useWatch({ control, name: "abilityScores" });

  // Templates are keyed by the selected id: a slow response for an earlier pick lands in its own
  // cache entry and can never overwrite the current one (the old useEffect race).
  const classTemplate: ClassTemplate | null =
    useQuery({ queryKey: queryKeys.classTemplate(classId), queryFn: () => fetchClass(classId), enabled: !!classId, ...reference }).data ?? null;
  const speciesTemplate: SpeciesTemplate | null =
    useQuery({ queryKey: queryKeys.speciesTemplate(speciesId), queryFn: () => fetchSpeciesByKey(speciesId), enabled: !!speciesId, ...reference }).data ?? null;
  const backgroundTemplate: BackgroundTemplate | null =
    useQuery({ queryKey: queryKeys.backgroundTemplate(backgroundId), queryFn: () => fetchBackground(backgroundId), enabled: !!backgroundId, ...reference }).data ?? null;

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

  // AC depends on the armor inside the chosen starting-equipment bundle (if any),
  // falling back to the class's armor training tier.
  const chosenEquipmentItems = resolveChosenEquipmentKeys(
    classTemplate,
    choices ?? {},
  );
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
