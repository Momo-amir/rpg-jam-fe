import { z } from "zod";

export const characterCardSchema = z.object({
  name: z.string(),
  level: z.number(),
  alignment: z.string(),
  pronouns: z.string(),
  class: z.string(),
  species: z.string(),
  background: z.string(),
});

export const characterCardListSchema = z.object({
  characterCards: z.array(characterCardSchema),
});

export type CharacterCard = z.infer<typeof characterCardSchema>;
