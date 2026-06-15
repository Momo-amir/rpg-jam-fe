import { z } from "zod";
import { apiClient } from "@/utils/api/client";
import { characterSchema } from "@/types/character";
import type { Character, CreateCharacterPayload } from "@/types/character";

export async function fetchCharacters(): Promise<Character[]> {
  const response = await apiClient.get("/api/characters");
  return z.array(characterSchema).parse(response.data);
}

export async function createCharacter(payload: CreateCharacterPayload): Promise<{ id: string }> {
  const response = await apiClient.post("/api/character/add", payload);
  return response.data;
}
