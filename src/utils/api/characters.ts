import { apiClient } from "@/utils/api/client";
import { characterCardListSchema } from "@/types/character";
import type { CharacterCard, CreateCharacterPayload } from "@/types/character";

export async function fetchCharacterCards(): Promise<CharacterCard[]> {
  const response = await apiClient.get("/api/characters/all");
  return characterCardListSchema.parse(response.data).characterCards;
}

export async function createCharacter(
  payload: CreateCharacterPayload,
): Promise<void> {
  await apiClient.post("/api/characters/add", payload);
}
