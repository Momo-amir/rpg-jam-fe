import { User } from "lucide-react";
import type { CharacterCard as CharacterCardData } from "@/types/character";

interface CharacterCardProps {
  character: CharacterCardData;
}

// Backend enums arrive as PascalCase ("LawfulGood", "HeHim"). Split on the case
// boundary and capitalise each word for display: "Lawful Good", "He Him".
function humanizeEnum(value: string): string {
  return value
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/^./, (character) => character.toUpperCase());
}

// Pronouns read better with a slash than a space: "HeHim" -> "He/Him".
function formatPronouns(value: string): string {
  return humanizeEnum(value).replace(" ", "/");
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <div className='group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-primary/10 bg-surface p-5'>
      <div className='flex items-center gap-4'>
        <div className='flex size-14 items-center justify-center rounded-full bg-primary/10'>
          <User size={24} className='text-primary/40' />
        </div>
        <div className='flex flex-col gap-0.5'>
          <h3 className='font-semibold text-primary'>{character.name}</h3>
          <p className='text-helper text-primary/60'>
            Level {character.level} · {humanizeEnum(character.class)} ·{" "}
            {humanizeEnum(character.species)}
          </p>
        </div>
      </div>

      <p className='text-helper text-primary/40'>
        {humanizeEnum(character.background)} · {humanizeEnum(character.alignment)}{" "}
        · {formatPronouns(character.pronouns)}
      </p>
    </div>
  );
}
