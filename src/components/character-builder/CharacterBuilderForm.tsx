"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Shield, Wand2 } from "lucide-react";
import Statbox, { Stats } from "@/components/ui/statbox";

import { Button } from "@/components/ui/button";
import { ChoiceModal } from "./ChoiceModal";
import { ChoiceTags } from "./ChoiceTags";
import { CharacterCreationCard } from "./CharacterCreationCard";
import { CharacterDetailsCard } from "./CharacterDetailsCard";
import { ProficienciesPanel } from "./ProficienciesPanel";
import {
  CHARACTER_SECTIONS,
  FIELD_BY_KEY,
  mapClass,
  mapSpecies,
  mapBackground,
} from "./character-sections.config";
import { normalizeClassChoices, normalizeSpeciesChoices } from "./normalizeChoices";
import { characterBuilderSchema } from "@/models/schemas/character-builder";
import {
  fetchClasses,
  fetchSpecies,
  fetchSpeciesByKey,
  fetchBackgrounds,
  fetchBackground,
  fetchClass,
} from "@/utils/api/character-options";
import type {
  CharacterBuilderFormValues as FormValues,
  ClassListItem,
  ClassTemplate,
  SpeciesListItem,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

function deriveAc(armorTraining: string[], dexMod: number): number {
  if (armorTraining.includes("Heavy")) return 16;
  if (armorTraining.includes("Medium")) return 13 + Math.min(dexMod, 2);
  if (armorTraining.includes("Light")) return 11 + dexMod;
  return 10 + dexMod;
}

export function CharacterBuilderForm() {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [species, setSpecies] = useState<SpeciesListItem[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundTemplate[]>([]);
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

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(characterBuilderSchema),
    defaultValues: {
      name: "",
      classId: "",
      speciesId: "",
      subspeciesId: undefined,
      backgroundId: "",
      abilityScores: {
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
      },
      choices: {},
      proficiencies: [],
      alignment: undefined,
      pronouns: undefined,
      portraitUrl: undefined,
    },
  });

  const [name, alignment, pronouns, classId, speciesId, backgroundId] =
    useWatch({
      control,
      name: [
        "name",
        "alignment",
        "pronouns",
        "classId",
        "speciesId",
        "backgroundId",
      ],
    });

  const choices = useWatch({ control, name: "choices" });
  const abilityScores = useWatch({ control, name: "abilityScores" });

  const conMod = Math.floor(((abilityScores?.constitution ?? 10) - 10) / 2);
  const dexMod = Math.floor(((abilityScores?.dexterity ?? 10) - 10) / 2);

  const derivedHp = classTemplate
    ? parseInt(classTemplate.hitDie.slice(1), 10) + conMod
    : null;
  const derivedAc = deriveAc(classTemplate?.armorTraining ?? [], dexMod);

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

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = CHARACTER_SECTIONS.map((section) => {
    const selectedIdByKey = {
      class: classId,
      species: speciesId,
      background: backgroundId,
    };
    const listByKey = {
      class: classes.map(mapClass),
      species: species.map(mapSpecies),
      background: backgrounds.map(mapBackground),
    };

    const selectedId = selectedIdByKey[section.key] ?? "";
    const list = listByKey[section.key];
    const selectedName = list.find((item) => item.id === selectedId)?.name;
    const selectedImage = list.find((item) => item.id === selectedId)?.image;

    return {
      ...section,
      list,
      selectedId,
      selectedName,
      selectedImage,
      field: FIELD_BY_KEY[section.key],
      choices:
        section.key === "class" && classTemplate
          ? normalizeClassChoices(classTemplate)
          : section.key === "species" && speciesTemplate
            ? normalizeSpeciesChoices(speciesTemplate)
            : [],
    };
  });

  function onSubmit(data: FormValues) {
    console.log("Character form submit:", data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h1>Create Your Character</h1>
        <p className='text-neutraltwo'>
          Build a level 1 character by filling in the sections below. Click any
          card to make your selections.
        </p>
      </div>

      <div className='grid grid-cols-6 grid-rows-3 gap-4'>
        {sections.map((section) => (
          <CharacterCreationCard
            key={section.key}
            label={section.label}
            description={section.description}
            icon={section.icon}
            backgroundImage={section.selectedImage ?? section.placeholderImage}
            grayscale={!section.selectedImage}
            displayValue={section.selectedName}
            onClick={() => setOpenModal(section.key)}
            className='col-span-6 md:col-span-4 md:col-start-1'
          >
            {section.choices.length > 0 && (
              <ChoiceTags
                choices={section.choices}
                selected={choices}
                onChoiceConfirm={(key, value) =>
                  setValue(`choices.${key}`, value, { shouldValidate: true })
                }
              />
            )}
          </CharacterCreationCard>
        ))}

        <div className='col-span-6 row-start-1 flex flex-col gap-3 md:col-span-2 md:col-start-5'>
          <CharacterDetailsCard
            className='flex-1'
            name={name ?? ""}
            alignment={alignment}
            pronouns={pronouns}
            nameError={errors.name?.message}
            onNameChange={(value) =>
              setValue("name", value, { shouldValidate: true })
            }
            onAlignmentChange={(value) =>
              setValue("alignment", value, { shouldValidate: true })
            }
            onPronounsChange={(value) =>
              setValue("pronouns", value, { shouldValidate: true })
            }
          />

          <div className='grid lg:grid-cols-2 gap-4'>
            <CharacterCreationCard
              label='Hit Points'
              description={
                derivedHp !== null ? `${derivedHp} HP` : "Choose a class"
              }
              icon={<Heart size={20} />}
              className='h-full'
            />
            <CharacterCreationCard
              label='Armor Class'
              description={`${derivedAc} AC`}
              icon={<Shield size={20} />}
              className='h-full'
            />
          </div>
        </div>

        <div className='col-span-6 row-start-2 grid grid-cols-2 lg:grid-cols-3 gap-4 md:col-span-2 md:col-start-5'>
          {Stats.map((stat) => (
            <Statbox
              key={stat.id}
              icon={stat.icon}
              shortname={stat.shortname}
              value={abilityScores?.[stat.field as keyof typeof abilityScores] ?? 10}
              onChange={(value) =>
                setValue(`abilityScores.${stat.field as keyof typeof abilityScores}`, value, { shouldValidate: true })
              }
            />
          ))}
        </div>

        <ProficienciesPanel
          classTemplate={classTemplate}
          speciesTemplate={speciesTemplate}
          backgroundTemplate={backgroundTemplate}
          choices={choices ?? {}}
        />
      </div>

      {sections.map((section) => (
        <ChoiceModal
          key={section.key}
          open={openModal === section.key}
          onOpenChange={(open) => setOpenModal(open ? section.key : null)}
          title={section.modalTitle}
          options={section.list}
          numberOfChoices={1}
          selected={section.selectedId || undefined}
          onConfirm={(value) => {
            setValue(section.field, value as string, { shouldValidate: true });
            setOpenModal(null);
          }}
        />
      ))}

      <div className='flex items-center justify-between border-t border-white/10 pt-6'>
        <div className='text-helper text-neutraltwo'>
          {Object.keys(errors).length > 0 && (
            <span className='text-error'>
              Please fill in all required fields.
            </span>
          )}
        </div>
        <Button type='submit' loading={isSubmitting} loadingText='Creating...'>
          <Wand2 size={16} />
          Create Character
        </Button>
      </div>
    </form>
  );
}
