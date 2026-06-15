"use client";

import { useState } from "react";

import { ChoiceModal } from "@/components/character-builder/modals/ChoiceModal";
import { Tag } from "@/components/ui/tag";
import type { ActiveChoice } from "@/types/character";

interface ChoiceTagsProps {
  choices: ActiveChoice[];
  selected: Record<string, string | string[]>;
  onChoiceConfirm: (key: string, value: string | string[]) => void;
  showErrors?: boolean;
}

export function ChoiceTags({
  choices,
  selected,
  onChoiceConfirm,
  showErrors = false,
}: ChoiceTagsProps) {
  const [activeChoice, setActiveChoice] = useState<ActiveChoice | null>(null);

  return (
    <>
      <div className='relative flex flex-wrap gap-2 px-5 pb-4'>
        {choices.map((choice) => {
          const selectedValue = selected[choice.key];
          const count = Array.isArray(selectedValue)
            ? selectedValue.length
            : selectedValue
              ? 1
              : 0;
          const done = count >= choice.numberOfChoices;
          const chosenLabel = done
            ? optionNames(choice, selectedValue)
            : undefined;
          return (
            <Tag
              key={choice.key}
              label={
                done
                  ? chosenLabel
                    ? `${choice.title}: ${chosenLabel}`
                    : choice.title
                  : `${choice.title} (${count}/${choice.numberOfChoices})`
              }
              variant={done ? "active" : showErrors ? "error" : "pending"}
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
          description={activeChoice.description}
          options={activeChoice.options}
          numberOfChoices={activeChoice.numberOfChoices}
          selected={selected[activeChoice.key]}
          onConfirm={(value) => {
            onChoiceConfirm(activeChoice.key, value);
            setActiveChoice(null);
          }}
        />
      )}
    </>
  );
}

// Turn the selected option id(s) into their display names, comma-joined.
function optionNames(
  choice: ActiveChoice,
  selectedValue: string | string[] | undefined,
): string | undefined {
  const nameFor = (id: string) =>
    choice.options.find((option) => option.id === id)?.name ?? id;

  if (typeof selectedValue === "string") return nameFor(selectedValue);
  if (Array.isArray(selectedValue)) return selectedValue.map(nameFor).join(", ");
  return undefined;
}
