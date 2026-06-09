"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Heart, Shield, Sparkles, Wand2 } from "lucide-react";
import Statbox, { Stats } from "@/components/ui/statbox";

import { Button } from "@/components/ui/button";
import { ChoiceModal } from "./ChoiceModal";
import { CharacterCreationCard } from "./CharacterCreationCard";
import { CharacterDetailsCard } from "./CharacterDetailsCard";
import { CHARACTER_SECTIONS } from "./character-sections.config";
import { characterBuilderSchema } from "@/models/schemas/character-builder";
import type {
  CharacterBuilderFormValues as FormValues,
  CharacterSectionKey,
} from "@/models/types/character-builder.types";

export function CharacterBuilderForm() {
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

  const [name, alignment, pronouns] = useWatch({
    control,
    name: ["name", "alignment", "pronouns"],
  });

  const [openModal, setOpenModal] = useState<CharacterSectionKey | null>(null);

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
        {CHARACTER_SECTIONS.map((section) => (
          <CharacterCreationCard
            key={section.key}
            label={section.label}
            description={section.description}
            icon={section.icon}
            backgroundImage={section.placeholderImage}
            onClick={() => setOpenModal(section.key)}
            className='col-span-6 md:col-span-4 md:col-start-1'
          />
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

          <div className='grid grid-cols-2 gap-4'>
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

        <div className='col-span-6 row-start-2 grid grid-cols-3 gap-4 md:col-span-2 md:col-start-5'>
          {Stats.map((stat) => (
            <Statbox key={stat.id} icon={stat.icon} shortname={stat.shortname} />
          ))}
        </div>

        <CharacterCreationCard
          label='Proficiencies'
          description='Proficiencies will appear here once you select a class and background.'
          icon={<Sparkles size={20} />}
          className='col-span-6 row-start-3 md:col-span-2 md:col-start-5'
        />
      </div>

      {CHARACTER_SECTIONS.map((section) => (
        <ChoiceModal
          key={section.key}
          open={openModal === section.key}
          onOpenChange={(open) => setOpenModal(open ? section.key : null)}
          title={section.modalTitle}
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
