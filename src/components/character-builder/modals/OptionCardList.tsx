"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { OptionCard } from "@/components/character-builder/cards/OptionCard";
import type { OptionItem } from "@/types/character";

interface SingleSelectProps {
  multiSelect?: false;
  selected: string | undefined;
  onConfirm: (selected: string) => void;
}

interface MultiSelectProps {
  multiSelect: true;
  count: number;
  selected: string[];
  onConfirm: (selected: string[]) => void;
}

type OptionCardListProps = {
  options: OptionItem[];
  label?: string;
} & (SingleSelectProps | MultiSelectProps);

export function OptionCardList(props: OptionCardListProps) {
  const { options, label } = props;

  const [localSingle, setLocalSingle] = useState<string | undefined>(
    props.multiSelect ? undefined : props.selected,
  );
  const [localMulti, setLocalMulti] = useState<string[]>(
    props.multiSelect ? props.selected : [],
  );

  function handleSelect(id: string) {
    if (props.multiSelect) {
      setLocalMulti((prev) =>
        prev.includes(id)
          ? prev.filter((s) => s !== id)
          : prev.length < props.count
            ? [...prev, id]
            : prev,
      );
    } else {
      setLocalSingle(id);
    }
  }

  function handleConfirm() {
    if (props.multiSelect) {
      props.onConfirm(localMulti);
    } else if (localSingle) {
      props.onConfirm(localSingle);
    }
  }

  const canConfirm = props.multiSelect
    ? localMulti.length === props.count
    : !!localSingle;

  const selectionStatus = props.multiSelect
    ? `${localMulti.length} / ${props.count} selected`
    : localSingle
      ? "1 selected"
      : "None selected";

  return (
    <div className='flex flex-col gap-4'>
      {label && (
        <div className='flex items-center justify-between'>
          <p className='text-helper text-primary/60'>{label}</p>
          <span className='text-helper font-medium text-secondary'>
            {selectionStatus}
          </span>
        </div>
      )}

      <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {options.map((option) => (
          <OptionCard
            key={option.id}
            option={option}
            multiSelect={props.multiSelect}
            selected={
              props.multiSelect
                ? localMulti.includes(option.id)
                : localSingle === option.id
            }
            disabled={
              props.multiSelect
                ? !localMulti.includes(option.id) &&
                  localMulti.length >= props.count
                : false
            }
            onSelect={handleSelect}
          />
        ))}
      </div>

      <div className='flex justify-end pt-2'>
        <Button onClick={handleConfirm} disabled={!canConfirm}>
          Confirm
        </Button>
      </div>
    </div>
  );
}
