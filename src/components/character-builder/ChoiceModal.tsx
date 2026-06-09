"use client";

import { Modal } from "@/components/ui/modal";
import { OptionCardList } from "./OptionCardList";
import type { OptionItem } from "@/models/types/character-builder.types";

interface ChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  options?: OptionItem[];
  numberOfChoices?: number;
  selected?: string | string[];
  onConfirm?: (value: string | string[]) => void;
}

export function ChoiceModal({
  open,
  onOpenChange,
  title,
  options,
  numberOfChoices = 1,
  selected,
  onConfirm,
}: ChoiceModalProps) {
  const selectedMulti = Array.isArray(selected) ? selected : []; // best practice type guard - outer check only makes sure things are truthy this is to make sure we are certain about the type
  const selectedSingle = typeof selected === "string" ? selected : undefined;
  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title}>
      {options && options.length > 0 && onConfirm ? (
        numberOfChoices > 1 ? (
          <OptionCardList
            multiSelect
            count={numberOfChoices}
            options={options}
            selected={selectedMulti}
            onConfirm={onConfirm}
          />
        ) : (
          <OptionCardList
            options={options}
            selected={selectedSingle}
            onConfirm={onConfirm}
          />
        )
      ) : (
        <div className='flex min-h-48 flex-col items-center justify-center'>
          <p className='text-helper text-neutraltwo/60'>
            No options available yet.
          </p>
        </div>
      )}
    </Modal>
  );
}
