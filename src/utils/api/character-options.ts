import { z } from "zod";
import { apiFetch } from "@/utils/api/fetch";
import {
  classListItemSchema,
  classTemplateSchema,
  speciesListItemSchema,
  speciesTemplateSchema,
  backgroundListItemSchema,
  backgroundTemplateSchema,
} from "@/types/character";

// Exact response envelopes, no guessing (`data.x ?? data`). Note: the API's species list
// currently uses a `classes` envelope (misnamed DTO on the backend); fix both sides together.
const classList = z.object({ classes: z.array(classListItemSchema) });
const speciesList = z.object({ classes: z.array(speciesListItemSchema) });
const backgroundList = z.object({ backgrounds: z.array(backgroundListItemSchema) });

export const fetchClasses = async () => (await apiFetch("/api/classes/all", classList)).classes;
export const fetchClass = (key: string) => apiFetch(`/api/classes/${key}`, classTemplateSchema);

export const fetchSpecies = async () => (await apiFetch("/api/species/all", speciesList)).classes;
export const fetchSpeciesByKey = (key: string) => apiFetch(`/api/species/${key}`, speciesTemplateSchema);

export const fetchBackgrounds = async () => (await apiFetch("/api/backgrounds/all", backgroundList)).backgrounds;
export const fetchBackground = (key: string) => apiFetch(`/api/backgrounds/${key}`, backgroundTemplateSchema);
