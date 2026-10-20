import { apiFetch } from "@/utils/api/fetch";
import { characterCardListSchema } from "@/types/character";
import type { CharacterCard, CreateCharacterPayload } from "@/types/character";

export async function fetchCharacterCards(): Promise<CharacterCard[]> {
  return (await apiFetch("/api/characters/all", characterCardListSchema)).characterCards;
}

export const createCharacter = (payload: CreateCharacterPayload) =>
  apiFetch("/api/characters/add", undefined, { method: "POST", body: payload });
