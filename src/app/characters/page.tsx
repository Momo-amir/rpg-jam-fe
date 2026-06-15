"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { fetchCharacterCards } from "@/utils/api/characters";
import { CharacterCard } from "@/components/character/CharacterCard";
import { buttonVariants } from "@/components/ui/button";
import type { CharacterCard as CharacterCardData } from "@/types/character";

export default function CharacterListPage() {
  const [characters, setCharacters] = useState<CharacterCardData[]>([]);

  useEffect(() => {
    fetchCharacterCards().then(setCharacters);
  }, []);

  return (
    <main className='container py-10'>
      <div className='flex items-center justify-between'>
        <h1>Your Characters</h1>
        <Link href='/characters/create' className={buttonVariants()}>
          <Plus size={16} />
          New Character
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className='mt-20 flex flex-col items-center gap-4 text-center'>
          <p className='text-primary/60'>No characters yet. Create your first one!</p>
          <Link href='/characters/create' className={buttonVariants({ size: "lg" })}>
            Create Character
          </Link>
        </div>
      ) : (
        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {/* Card response has no stable id yet; index key until the backend supplies one. */}
          {characters.map((character, index) => (
            <CharacterCard key={index} character={character} />
          ))}
        </div>
      )}
    </main>
  );
}
