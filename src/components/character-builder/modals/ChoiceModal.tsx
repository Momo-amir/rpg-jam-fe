"use client";

import { Modal } from "@/components/ui/modal";
import { OptionCardList } from "@/components/character-builder/modals/OptionCardList";
import type { OptionItem } from "@/types/character";

interface ChoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  options?: OptionItem[];
  numberOfChoices?: number;
  selected?: string | string[];
  onConfirm?: (value: string | string[]) => void;
}

export function ChoiceModal({
  open,
  onOpenChange,
  title,
  description,
  options,
  numberOfChoices = 1,
  selected,
  onConfirm,
}: ChoiceModalProps) {
  // Split the incoming selection into the two shapes OptionCardList expects.
  const selectedMulti = Array.isArray(selected) ? selected : [];
  const selectedSingle = typeof selected === "string" ? selected : undefined;
  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
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
          <p className='text-helper text-primary/40'>
            No options available yet.
          </p>
        </div>
      )}
    </Modal>
  );
}
