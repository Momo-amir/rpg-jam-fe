import { z } from "zod";

// One character as returned by the card list view. The class/species/background/
// alignment/pronouns fields are backend-driven PascalCase enum names — we keep
// them as plain strings (not frontend z.enum unions) so a newly-seeded value
// never breaks the list parse. The card UI just humanizes them for display.
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
