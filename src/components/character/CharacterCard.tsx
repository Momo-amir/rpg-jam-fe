import Link from "next/link";
import { User } from "lucide-react";
import type { Character } from "@/models/types/character-builder.types";

interface CharacterCardProps {
  character: Character;
}

export function CharacterCard({ character }: CharacterCardProps) {
  return (
    <Link
      href={`/characters/${character.id}`}
      className='group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-primary/10 bg-surface p-5 transition-colors hover:border-primary/30 hover:bg-surface/80'
    >
      <div className='flex items-center gap-4'>
        {character.portraitUrl ? (
          <img
            src={character.portraitUrl}
            alt={character.name}
            className='size-14 rounded-full object-cover'
          />
        ) : (
          <div className='flex size-14 items-center justify-center rounded-full bg-primary/10'>
            <User size={24} className='text-primary/40' />
          </div>
        )}
        <div className='flex flex-col gap-0.5'>
          <h3 className='text-base font-semibold'>{character.name}</h3>
          <p className='text-helper text-primary/60'>
            Level {character.level} · {character.classId} · {character.speciesId}
          </p>
        </div>
      </div>

      {character.alignment && (
        <p className='text-helper text-primary/40'>{character.alignment}</p>
      )}
    </Link>
  );
}
