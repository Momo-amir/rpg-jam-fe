import { z } from "zod";

// The request body for POST /api/character/add (the backend Character entity shape).
// Enum-typed fields are plain strings: we send PascalCase member names and let the
// backend's JsonStringEnumConverter validate them. See utils/character/build-payload.ts.
export const createCharacterPayloadSchema = z.object({
  level: z.number(),
  details: z.object({
    name: z.string(),
    pronouns: z.string(),
    alignment: z.string(),
    backstory: z.string(),
    appearance: z.string(),
    personality: z.string(),
  }),
  hitPoints: z.object({
    max: z.number(),
    hitDice: z.string(),
  }),
  background: z.string(),
  class: z.object({
    class: z.string(),
  }),
  speciesTraits: z.object({
    creatureType: z.string(),
    size: z.string(),
    speed: z.number(),
    lineage: z.string(),
  }),
  abilities: z.object({
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
  }),
  proficiencies: z.object({
    skills: z.array(z.string()),
    tools: z.array(z.string()),
    weapons: z.array(z.string()),
    armors: z.array(z.string()),
    languages: z.array(z.string()),
  }),
  classFeatures: z.array(z.string()),
  feats: z.array(z.string()),
  weaponMasteries: z.array(z.string()).optional(),
  cantrips: z.array(z.string()).optional(),
  spells: z.array(z.string()).optional(),
  armorClass: z.number(),
  startingEquipment: z.array(
    z.object({
      referenceKey: z.string(),
      quantity: z.number(),
      type: z.string(),
    }),
  ),
});

export type CreateCharacterPayload = z.infer<typeof createCharacterPayloadSchema>;
