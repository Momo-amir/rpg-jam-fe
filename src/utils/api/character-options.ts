import { apiClient } from "@/utils/api/client";
import { z } from "zod";
import {
  classListItemSchema,
  classTemplateSchema,
  speciesTemplateSchema,
  backgroundTemplateSchema,
} from "@/models/schemas/character-builder";
import type {
  ClassListItem,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

export async function fetchClasses(): Promise<ClassListItem[]> {
  const response = await apiClient.get("/api/getclasses");
  return z
    .array(classListItemSchema)
    .parse(response.data.classes ?? response.data);
}

export async function fetchClass(id: string): Promise<ClassTemplate> {
  const response = await apiClient.get("/api/getclasses");
  const classes = z
    .array(classTemplateSchema)
    .parse(response.data.classes ?? response.data);
  const found = classes.find((c) => c.id === id);
  if (!found) throw new Error(`Class not found: ${id}`);
  return found;
}

export async function fetchSpecies(): Promise<SpeciesTemplate[]> {
  const response = await apiClient.get("/api/getspecies");
  return z
    .array(speciesTemplateSchema)
    .parse(response.data.species ?? response.data);
}

export async function fetchSpeciesById(id: string): Promise<SpeciesTemplate> {
  const response = await apiClient.get("/api/getspecies");
  const species = z
    .array(speciesTemplateSchema)
    .parse(response.data.species ?? response.data);
  const found = species.find((s) => s.id === id);
  if (!found) throw new Error(`Species not found: ${id}`);
  return found;
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
