"use client";

import { useState } from "react";

import { ChoiceModal } from "./ChoiceModal";
import { Tag } from "@/components/ui/tag";
import type { ClassTemplate } from "@/models/types/character-builder.types";

interface ActiveChoice {
  key: string;
  title: string;
  numberOfChoices: number;
  options: string[];
}

interface ClassChoiceTagsProps {
  template: ClassTemplate;
  choices: Record<string, string | string[]>;
  onChoiceConfirm: (key: string, value: string | string[]) => void;
}

export function ClassChoiceTags({
  template,
  choices,
  onChoiceConfirm,
}: ClassChoiceTagsProps) {
  const [activeChoice, setActiveChoice] = useState<ActiveChoice | null>(null);

  const allChoices: ActiveChoice[] = [
    {
      key: "skills",
      title: "Choose Skills",
      numberOfChoices: template.skillChoice.numberOfChoices,
      options: template.skillChoice.options,
    },
    ...template.classChoice.map((choice) => ({
      key: choice.type,
      title: choice.label,
      numberOfChoices: choice.numberOfChoices,
      options: choice.options,
    })),
  ];

  return (
    <>
      <div className='relative flex flex-wrap gap-2 px-5 pb-4'>
        {allChoices.map((choice) => {
          const count = Array.isArray(choices[choice.key])
            ? (choices[choice.key] as string[]).length
            : choices[choice.key]
              ? 1
              : 0;
          const done = count >= choice.numberOfChoices;
          return (
            <Tag
              key={choice.key}
              label={
                done
                  ? `${choice.title}`
                  : `${choice.title} (${count}/${choice.numberOfChoices})`
              }
              variant={done ? "active" : "pending"}
              onClick={() => setActiveChoice(choice)}
            />
          );
        })}
      </div>

      {activeChoice && (
        <ChoiceModal
          open
          onOpenChange={(open) => !open && setActiveChoice(null)}
          title={activeChoice.title}
          options={activeChoice.options.map((option) => ({
            id: option,
            name: option,
            description: "",
          }))}
          numberOfChoices={activeChoice.numberOfChoices}
          selected={choices[activeChoice.key]}
          onConfirm={(value) => {
            onChoiceConfirm(activeChoice.key, value);
            setActiveChoice(null);
          }}
        />
      )}
    </>
  );
}
