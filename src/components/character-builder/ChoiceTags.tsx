"use client";

import { useState } from "react";

import { ChoiceModal } from "./ChoiceModal";
import { Tag } from "@/components/ui/tag";
import type { ActiveChoice } from "@/models/types/character-builder.types";

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
          const count = Array.isArray(selected[choice.key])
            ? (selected[choice.key] as string[]).length
            : selected[choice.key]
              ? 1
              : 0;
          const done = count >= choice.numberOfChoices;
          const selectedValue = selected[choice.key];
          const chosenLabel = done
            ? typeof selectedValue === "string"
              ? choice.options.find((o) => o.id === selectedValue)?.name ?? selectedValue
              : Array.isArray(selectedValue)
                ? selectedValue
                    .map((id) => choice.options.find((o) => o.id === id)?.name ?? id)
                    .join(", ")
                : undefined
            : undefined;
          return (
            <Tag
              key={choice.key}
              label={done
                ? chosenLabel ? `${choice.title}: ${chosenLabel}` : choice.title
                : `${choice.title} (${count}/${choice.numberOfChoices})`}
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
