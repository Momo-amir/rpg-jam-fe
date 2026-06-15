import { z } from "zod";

// A saved character as returned by the API.
export const characterSchema = z.object({
  id: z.string(),
  name: z.string(),
  classId: z.string(),
  speciesId: z.string(),
  subspeciesId: z.string().optional(),
  backgroundId: z.string(),
  level: z.number().default(1),
  abilityScores: z.object({
    strength: z.number(),
    dexterity: z.number(),
    constitution: z.number(),
    intelligence: z.number(),
    wisdom: z.number(),
    charisma: z.number(),
  }),
  alignment: z.string().optional(),
  pronouns: z.string().optional(),
  portraitUrl: z.string().optional(),
});

// Ability scores as entered in the builder (1–30, validated).
export const abilityScoresSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
});

// The character-builder form's values (validated by react-hook-form's resolver).
export const characterBuilderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classId: z.string().min(1, "Class is required"),
  speciesId: z.string().min(1, "Species is required"),
  subspeciesId: z.string().optional(),
  backgroundId: z.string().min(1, "Background is required"),
  abilityScores: abilityScoresSchema,
  choices: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  alignment: z.string().min(1, "Alignment is required"),
  pronouns: z.string().min(1, "Pronouns are required"),
  portraitUrl: z.string().optional(),
  // No UI yet, sent as "" in the payload. TODO: add inputs to send real values for these.
  backstory: z.string().optional(),
  appearance: z.string().optional(),
  personality: z.string().optional(),
});

export type Character = z.infer<typeof characterSchema>;
export type CharacterBuilderFormValues = z.infer<typeof characterBuilderSchema>;
