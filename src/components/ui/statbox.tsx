"use client";

import { Button } from "./button";
import { LucideIcon } from 'lucide-react';
import { BicepsFlexed, BowArrow, Bone, Brain, BookOpenText, MessageCircleHeart } from "lucide-react";

type StatProps = {
  shortname: string;
  icon: LucideIcon;
  value: number;
  onChange: (value: number) => void;
};

export const Stats: { id: number; title: string; shortname: string; icon: LucideIcon; field: string }[] = [
  { id: 1, title: "Strength",     shortname: "STR", icon: BicepsFlexed,     field: "strength"     },
  { id: 2, title: "Dexterity",    shortname: "DEX", icon: BowArrow,         field: "dexterity"    },
  { id: 3, title: "Constitution", shortname: "CON", icon: Bone,             field: "constitution" },
  { id: 4, title: "Wisdom",       shortname: "WIS", icon: Brain,            field: "wisdom"       },
  { id: 5, title: "Intelligence", shortname: "INT", icon: BookOpenText,     field: "intelligence" },
  { id: 6, title: "Charisma",     shortname: "CHA", icon: MessageCircleHeart, field: "charisma"   },
];

export default function Statbox({ shortname, icon: Icon, value, onChange }: StatProps) {
  const score = value;
  const mod = Math.floor((score - 10) / 2);

  function change(next: number) {
    onChange(Math.min(20, Math.max(1, next)));
  }

  return (
    <div className='flex flex-col items-center border rounded-lg border-primary/10 px-4 py-3 gap-2 bg-surface/60'>
      <div className="flex flex-row gap-2 items-center">
        <Icon size={16} />
        <span className='text-sm font-semibold'>{shortname}</span>
      </div>
      <span className='text-2xl font-bold'>{mod >= 0 ? `+${mod}` : mod}</span>
      <div className='flex items-center gap-2 px-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => change(score - 1)}
          disabled={score <= 1}
          className={"w-5"}
        >
          −
        </Button>

        <input
          inputMode='numeric'
          pattern='[0-9]*'
          value={score}
          onChange={(event) => change(parseInt(event.target.value) || 0)}
          onFocus={(event) => event.target.select()}
          className='w-10 text-center border border-primary/20 rounded-lg h-10 bg-transparent text-primary'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => change(score + 1)}
          disabled={score >= 20}
          className={"w-5"}
        >
          +
        </Button>
      </div>
    </div>
  );
}
