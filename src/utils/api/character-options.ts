import { apiClient } from "@/utils/api/client";
import { z } from "zod";
import {
  classListItemSchema,
  classTemplateSchema,
  speciesListItemSchema,
  speciesTemplateSchema,
  backgroundTemplateSchema,
} from "@/models/schemas/character-builder";
import type {
  ClassListItem,
  ClassTemplate,
  SpeciesListItem,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

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

export async function fetchBackgrounds(): Promise<BackgroundTemplate[]> {
  const response = await apiClient.get("/api/getbackgrounds");
  return z
    .array(backgroundTemplateSchema)
    .parse(response.data.backgrounds ?? response.data);
}

export async function fetchBackground(id: string): Promise<BackgroundTemplate> {
  const response = await apiClient.get("/api/getbackgrounds");
  const backgrounds = z
    .array(backgroundTemplateSchema)
    .parse(response.data.backgrounds ?? response.data);
  const found = backgrounds.find((b) => b.id === id);
  if (!found) throw new Error(`Background not found: ${id}`);
  return found;
}
