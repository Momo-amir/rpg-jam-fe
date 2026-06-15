import { z } from "zod";
import { apiClient } from "@/utils/api/client";
import { characterSchema } from "@/models/schemas/character-builder";
import type { Character, CharacterBuilderFormValues } from "@/models/types/character-builder.types";

export async function fetchCharacters(): Promise<Character[]> {
  const response = await apiClient.get("/api/characters");
  return z.array(characterSchema).parse(response.data);
}

export async function createCharacter(data: CharacterBuilderFormValues): Promise<{ id: string }> {
  const response = await apiClient.post("/api/characters", data);
  return response.data;
}
