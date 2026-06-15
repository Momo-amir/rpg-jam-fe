"use client";

import { cn } from "@/utils/cn";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectPopup,
  SelectItem,
  SelectScrollUpArrow,
  SelectScrollDownArrow,
} from "@/components/ui/select";

const ALIGNMENTS = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "True Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const PRONOUNS = [
  "He/Him",
  "She/Her",
  "They/Them",
  "He/They",
  "She/They",
  "Any/All",
];

export function CharacterDetailsCard({
  name,
  alignment,
  pronouns,
  nameError,
  className,
  style,
  onNameChange,
  onAlignmentChange,
  onPronounsChange,
}: {
  name: string;
  alignment: string | undefined;
  pronouns: string | undefined;
  nameError?: string;
  className?: string;
  style?: React.CSSProperties;
  onNameChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
  onPronounsChange: (value: string) => void;
}) {
  return (
    <div
      style={style}
      className={cn(
        "flex flex-col gap-3 rounded-xl border bg-surface/60 p-4 transition-all",
        name ? "border-white/10" : "border-dashed border-white/10",
        className,
      )}
    >
      <span className='text-helper font-medium uppercase tracking-wider text-primary/60'>
        Character Details
      </span>

      <input
        type='text'
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder='Enter a name...'
        className='w-full bg-transparent text-h3 font-h3 leading-h3 text-primary outline-none placeholder:text-primary/40'
      />
      {nameError && <p className='error-text'>{nameError}</p>}

      <div className='flex flex-col lg:flex-row gap-2 border-t border-white/10 pt-3'>
        <Select
          value={alignment ?? ""}
          onValueChange={(value) => value && onAlignmentChange(value)}
        >
          <SelectTrigger size='sm' className='w-auto'>
            <SelectValue placeholder='Alignment' />
          </SelectTrigger>
          <SelectPopup>
            <SelectScrollUpArrow />
            {ALIGNMENTS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
            <SelectScrollDownArrow />
          </SelectPopup>
        </Select>

        <Select
          value={pronouns ?? ""}
          onValueChange={(value) => value && onPronounsChange(value)}
        >
          <SelectTrigger size='sm' className='w-auto'>
            <SelectValue placeholder='Pronouns' />
          </SelectTrigger>
          <SelectPopup>
            <SelectScrollUpArrow />
            {PRONOUNS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
            <SelectScrollDownArrow />
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
