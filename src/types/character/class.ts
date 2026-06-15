import { z } from "zod";
import { diceTypeSchema } from "./enums";
import { classChoiceSchema, classFeatureSchema } from "./choices";

// Full class template (fetched when a class is selected).
export const classTemplateSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  hitDie: diceTypeSchema,
  primaryAbilities: z.array(z.string()),
  savingThrow: z.array(z.string()).optional(),
  weaponProficiency: z.array(z.string()),
  armorTraining: z.array(z.string()),
  classFeatures: z.array(classFeatureSchema).optional(),
  choices: z.array(classChoiceSchema).optional(),
});

// Lightweight class entry (used to populate the selection list/modal).
export const classListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  hitDie: diceTypeSchema,
  primaryAbilities: z.array(z.string()),
  weaponProficiency: z.array(z.string()),
  armorTraining: z.array(z.string()),
});

export type ClassTemplate = z.infer<typeof classTemplateSchema>;
export type ClassListItem = z.infer<typeof classListItemSchema>;
