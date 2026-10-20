"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCharacterCards } from "@/utils/api/characters";
import { queryKeys } from "@/utils/api/query-keys";
import { CharacterCard } from "@/components/character/CharacterCard";
import { buttonVariants } from "@/components/ui/button";

export default function CharacterListPage() {
  const { data: characters, isPending, isError, refetch } = useQuery({
    queryKey: queryKeys.characters,
    queryFn: fetchCharacterCards,
  });

  return (
    <main className='container py-10'>
      <div className='flex items-center justify-between'>
        <h1>Your Characters</h1>
        <Link href='/characters/create' className={buttonVariants()}>
          <Plus size={16} />
          New Character
        </Link>
      </div>

      {isPending ? (
        <div className='mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3' aria-busy='true'>
          {[0, 1, 2].map((i) => (
            <div key={i} className='h-40 animate-pulse rounded-2xl bg-primary/10' />
          ))}
        </div>
      ) : isError ? (
        <div className='mt-20 flex flex-col items-center gap-4 text-center'>
          <p className='text-primary/60'>Could not load your characters.</p>
          <button type='button' className={buttonVariants({ variant: "outline" })} onClick={() => refetch()}>
            Try again
          </button>
        </div>
      ) : characters.length === 0 ? (
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
