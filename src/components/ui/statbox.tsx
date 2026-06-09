import { useState } from "react";

type StatProps = {
  title: string;
  shortname: string;
  score: number;
  modifier: number;
};

export const Stats = [
  { id: 1, title: "Strength", shortname: "STR", score: 18, modifier: 4 },
  { id: 2, title: "Agility", score: 18, shortname: "AGI", modifier: 4 },
  { id: 3, title: "Constitution", score: 18, shortname: "CON", modifier: 4 },
  { id: 4, title: "Wisdom", score: 18, shortname: "WIS", modifier: 4 },
  { id: 5, title: "Intelligence", score: 18, shortname: "INT", modifier: 4 },
  { id: 6, title: "Charisma", score: 18, shortname: "CHA", modifier: 4 },
];

export default function Statbox({
  title,
  shortname,
  score,
  modifier,
}: StatProps) {
  const [scores, setScores] = useState(10);

  return (
    <div>
      <div className='flex justify-center flex-col items-center border-border border w-full p-4'>
        <h5>{shortname}</h5>
        <h2>{modifier}</h2>
        <input
          type='number'
          className='w-fit px-4'
          min={1}
          max={20}
          onChange={(e) => setScores(parseInt(e.target.value))}
          value={scores}
        ></input>
      </div>
    </div>
  );
}
