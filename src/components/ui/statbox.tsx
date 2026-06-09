"use client";

import { useState } from "react";
import { Button } from "./button";

type StatProps = {
  shortname: string;
};

export const Stats = [
  { id: 1, title: "Strength", shortname: "STR" },
  { id: 2, title: "Agility", shortname: "AGI" },
  { id: 3, title: "Constitution", shortname: "CON" },
  { id: 4, title: "Wisdom", shortname: "WIS" },
  { id: 5, title: "Intelligence", shortname: "INT" },
  { id: 6, title: "Charisma", shortname: "CHA" },
];

export default function Statbox({ shortname }: StatProps) {
  const [score, setScore] = useState(10);
  const mod = Math.floor((score - 10) / 2);

  function change(next: number) {
    setScore(Math.min(20, Math.max(1, next)));
  }

  return (
    <div className='flex flex-col items-center border rounded-lg border-white/10 p-4 gap-2'>
      <span className='text-sm font-semibold'>{shortname}</span>
      <span className='text-3xl font-bold'>{mod >= 0 ? `+${mod}` : mod}</span>
      <div className='flex items-center gap-2 px-2'>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => change(score - 1)}
          disabled={score <= 1}
          className={"w-4"}
        >
          −
        </Button>
        <input
          inputMode='numeric'
          pattern='[0-9]*'
          value={score}
          onChange={(event) => change(parseInt(event.target.value) || 0)}
          onFocus={(event) => event.target.select()}
          className='w-12 text-center border border-border rounded-lg h-10 bg-transparent'
        />
        <Button
          variant='ghost'
          size='icon'
          onClick={() => change(score + 1)}
          disabled={score >= 20}
          className={"w-4"}
        >
          +
        </Button>
      </div>
    </div>
  );
}
