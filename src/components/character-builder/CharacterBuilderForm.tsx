"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Shield, Sparkles, Wand2 } from "lucide-react";
import Statbox, { Stats } from "@/components/ui/statbox";

import { Button } from "@/components/ui/button";
import { ChoiceModal } from "./ChoiceModal";
import { ChoiceTags } from "./ChoiceTags";
import { CharacterCreationCard } from "./CharacterCreationCard";
import { CharacterDetailsCard } from "./CharacterDetailsCard";
import { CHARACTER_SECTIONS } from "./character-sections.config";
import { normalizeChoices } from "./normalizeChoices";
import { characterBuilderSchema } from "@/models/schemas/character-builder";
import {
  fetchClasses,
  fetchSpecies,
  fetchSpeciesById,
  fetchBackgrounds,
  fetchBackground,
  fetchClass,
} from "@/utils/api/character-options";
import {
  backgroundImages,
  classImages,
  speciesImages,
} from "@/utils/api/character-images";
import type {
  CharacterBuilderFormValues as FormValues,
  ClassListItem,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

export function CharacterBuilderForm() {
  const [classes, setClasses] = useState<ClassListItem[]>([]);
  const [species, setSpecies] = useState<SpeciesTemplate[]>([]);
  const [backgrounds, setBackgrounds] = useState<BackgroundTemplate[]>([]);
  const [classTemplate, setClassTemplate] = useState<ClassTemplate | null>(
    null,
  );
  const [speciesTemplate, setSpeciesTemplate] =
    useState<SpeciesTemplate | null>(null);
  const [backgroundTemplate, setBackgroundTemplate] =
    useState<BackgroundTemplate | null>(null);

  useEffect(() => {
    Promise.all([fetchClasses(), fetchSpecies(), fetchBackgrounds()]).then(
      ([fetchedClasses, fetchedSpecies, fetchedBackgrounds]) => {
        setClasses(fetchedClasses);
        setSpecies(fetchedSpecies);
        setBackgrounds(fetchedBackgrounds);
      },
    );
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

  useEffect(() => {
    if (!classId) return;
    fetchClass(classId).then(setClassTemplate);
  }, [classId]);

  useEffect(() => {
    if (!speciesId) return;
    fetchSpeciesById(speciesId).then(setSpeciesTemplate);
  }, [speciesId]);

  useEffect(() => {
    if (!backgroundId) return;
    fetchBackground(backgroundId).then(setBackgroundTemplate);
  }, [backgroundId]);

  const [openModal, setOpenModal] = useState<string | null>(null);

  const sections = CHARACTER_SECTIONS.map((section) => {
    const templateByKey = {
      class: classTemplate,
      species: speciesTemplate,
      background: backgroundTemplate,
    };
    const selectedIdByKey = {
      class: classId,
      species: speciesId,
      background: backgroundId,
    };
    const listByKey = {
      class: classes.map((playableClass) => ({
        id: playableClass.id,
        name: playableClass.name,
        description: playableClass.description,
        image: classImages[playableClass.id],
        tags: [
          ...(playableClass.hitDie ? [`D` + playableClass.hitDie] : []),
          ...(playableClass.primaryAbilities ?? []),
          ...(playableClass.armorTraining ?? []),
        ],
      })),
      species: species.map((playableSpecies) => ({
        id: playableSpecies.id,
        name: playableSpecies.name,
        description: playableSpecies.type ?? "",
        image: speciesImages[playableSpecies.id],
        tags:
          playableSpecies.choices?.[0]?.specialTraits?.map(
            (trait) => trait.name,
          ) ?? [],
      })),
      background: backgrounds.map((background) => ({
        id: background.id,
        name: background.name,
        description: background.description ?? "",
        tags: [
          ...(background.feat ? [background.feat] : []),
          ...(background.skillProficiencies ?? []),
          ...(background.abilityScores ?? []),
        ],
        image: backgroundImages[background.id],
      })),
    };
    const fieldByKey = {
      class: "classId",
      species: "speciesId",
      background: "backgroundId",
    } as const;

    const template = templateByKey[section.key];
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
      field: fieldByKey[section.key],
      choices: template ? normalizeChoices(template) : [],
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
              description='How much damage you can take.'
              icon={<Heart size={20} />}
              className='h-full'
            />
            <CharacterCreationCard
              label='Armor Class'
              description='How hard you are to hit.'
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
            />
          ))}
        </div>

        <CharacterCreationCard
          label='Proficiencies'
          description='Proficiencies will appear here once you select a class and background.'
          icon={<Sparkles size={20} />}
          className='col-span-6 row-start-3 md:col-span-2 md:col-start-5'
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
