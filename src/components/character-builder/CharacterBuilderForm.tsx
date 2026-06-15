"use client";

import { useState } from "react";
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
import { useCharacterBuilder } from "./useCharacterBuilder";
import { characterBuilderSchema } from "@/models/schemas/character-builder";
import { createCharacter } from "@/utils/api/characters";
import { buildCreateCharacterPayload } from "@/utils/character";
import type { CharacterBuilderFormValues as FormValues } from "@/models/types/character-builder.types";

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
      alignment: undefined,
      pronouns: undefined,
      portraitUrl: undefined,
    },
  });

  const {
    classTemplate,
    speciesTemplate,
    backgroundTemplate,
    sections,
    hasIncompleteChoices,
    derivedHp,
    derivedAc,
  } = useCharacterBuilder(control, setValue);

  const [name, alignment, pronouns] = useWatch({
    control,
    name: ["name", "alignment", "pronouns"],
  });
  const choices = useWatch({ control, name: "choices" });
  const abilityScores = useWatch({ control, name: "abilityScores" });

  const [openModal, setOpenModal] = useState<string | null>(null);
  const [choiceErrorsRequested, setChoiceErrorsRequested] = useState(false);

  // Only flag incomplete tags once the user has tried to submit; clears itself
  // automatically once everything is chosen (no effect needed — pure derivation).
  const showChoiceErrors = choiceErrorsRequested && hasIncompleteChoices;

  async function onSubmit(data: FormValues) {
    if (hasIncompleteChoices) {
      setChoiceErrorsRequested(true);
      return;
    }
    const payload = buildCreateCharacterPayload(data, {
      classTemplate,
      speciesTemplate,
      backgroundTemplate,
      derivedHp,
      derivedAc,
    });
    await createCharacter(payload);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-6'>
      <div className='flex flex-col gap-2'>
        <h1>Create Your Character</h1>
        <p className='text-primary/60'>
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
            error={!!errors[section.field]}
          >
            {section.choices.length > 0 && (
              <ChoiceTags
                choices={section.choices}
                selected={choices}
                showErrors={showChoiceErrors}
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
              value={
                abilityScores?.[stat.field as keyof typeof abilityScores] ?? 10
              }
              onChange={(value) =>
                setValue(
                  `abilityScores.${stat.field as keyof typeof abilityScores}`,
                  value,
                  { shouldValidate: true },
                )
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
        <div className='text-helper text-primary/60'>
          {(Object.keys(errors).length > 0 || showChoiceErrors) && (
            <span className='text-error'>
              Please fill in all required fields and choices.
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
