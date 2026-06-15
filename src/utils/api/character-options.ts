import { apiClient } from "@/utils/api/client";
import { z } from "zod";
import {
  classListItemSchema,
  classTemplateSchema,
  speciesListItemSchema,
  speciesTemplateSchema,
  backgroundListItemSchema,
  backgroundTemplateSchema,
} from "@/types/character";
import type {
  ClassListItem,
  ClassTemplate,
  SpeciesListItem,
  SpeciesTemplate,
  BackgroundListItem,
  BackgroundTemplate,
} from "@/types/character";

export async function fetchClasses(): Promise<ClassListItem[]> {
  const response = await apiClient.get("/api/classes/all");
  const raw = response.data.classes ?? response.data;
  const result = z.array(classListItemSchema).safeParse(raw);
  if (!result.success) {
    console.error("[fetchClasses] parse error", result.error.flatten(), raw);
    throw result.error;
  }
  return result.data;
}

export async function fetchClass(key: string): Promise<ClassTemplate> {
  const response = await apiClient.get(`/api/classes/${key}`);
  return classTemplateSchema.parse(response.data);
}

export async function fetchSpecies(): Promise<SpeciesListItem[]> {
  const response = await apiClient.get("/api/species/all");
  return z.array(speciesListItemSchema).parse(response.data.classes ?? response.data);
}

export async function fetchSpeciesByKey(key: string): Promise<SpeciesTemplate> {
  const response = await apiClient.get(`/api/species/${key}`);
  return speciesTemplateSchema.parse(response.data);
}

export async function fetchBackgrounds(): Promise<BackgroundListItem[]> {
  const response = await apiClient.get("/api/backgrounds/all");
  return z
    .array(backgroundListItemSchema)
    .parse(response.data.backgrounds ?? response.data);
}

export async function fetchBackground(key: string): Promise<BackgroundTemplate> {
  const response = await apiClient.get(`/api/background/${key}`);
  return backgroundTemplateSchema.parse(response.data);
}
