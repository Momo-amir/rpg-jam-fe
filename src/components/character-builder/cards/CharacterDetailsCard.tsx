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

// value = backend enum member name (what we send and store); label = display only.
const ALIGNMENTS = [
  { value: "LawfulGood", label: "Lawful Good" },
  { value: "NeutralGood", label: "Neutral Good" },
  { value: "ChaoticGood", label: "Chaotic Good" },
  { value: "LawfulNeutral", label: "Lawful Neutral" },
  { value: "TrueNeutral", label: "True Neutral" },
  { value: "ChaoticNeutral", label: "Chaotic Neutral" },
  { value: "LawfulEvil", label: "Lawful Evil" },
  { value: "NeutralEvil", label: "Neutral Evil" },
  { value: "ChaoticEvil", label: "Chaotic Evil" },
];

const PRONOUNS = [
  { value: "HeHim", label: "He/Him" },
  { value: "SheHer", label: "She/Her" },
  { value: "TheyThem", label: "They/Them" },
  { value: "HeThey", label: "He/They" },
  { value: "SheThey", label: "She/They" },
  { value: "AnyAll", label: "Any/All" },
];

interface CharacterDetailsCardProps {
  name: string;
  alignment: string | undefined;
  pronouns: string | undefined;
  nameError?: string;
  className?: string;
  style?: React.CSSProperties;
  onNameChange: (value: string) => void;
  onAlignmentChange: (value: string) => void;
  onPronounsChange: (value: string) => void;
}

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
}: CharacterDetailsCardProps) {
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
            <SelectValue placeholder='Alignment'>
              {(value: string) =>
                ALIGNMENTS.find((option) => option.value === value)?.label ??
                "Alignment"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectPopup>
            <SelectScrollUpArrow />
            {ALIGNMENTS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
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
            <SelectValue placeholder='Pronouns'>
              {(value: string) =>
                PRONOUNS.find((option) => option.value === value)?.label ??
                "Pronouns"
              }
            </SelectValue>
          </SelectTrigger>
          <SelectPopup>
            <SelectScrollUpArrow />
            {PRONOUNS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
            <SelectScrollDownArrow />
          </SelectPopup>
        </Select>
      </div>
    </div>
  );
}
