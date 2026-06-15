import { z } from "zod";
import { classChoiceSchema } from "./choices";

export const backgroundListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
});

export const backgroundTemplateSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
  choices: z.array(classChoiceSchema).optional(),
});

export type BackgroundListItem = z.infer<typeof backgroundListItemSchema>;
export type BackgroundTemplate = z.infer<typeof backgroundTemplateSchema>;
