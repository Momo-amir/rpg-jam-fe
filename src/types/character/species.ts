import { z } from "zod";
import { classChoiceSchema } from "./choices";

export const speciesListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  creatureType: z.string().optional(),
  traits: z.array(z.string()).optional(),
});

export const speciesTemplateSchema = z.object({
  key: z.string(),
  name: z.string(),
  creatureType: z.string().optional(),
  speed: z.number().optional(),
  traits: z.array(z.string()).optional(),
  choices: z.array(classChoiceSchema).optional(),
});

export type SpeciesListItem = z.infer<typeof speciesListItemSchema>;
export type SpeciesTemplate = z.infer<typeof speciesTemplateSchema>;
