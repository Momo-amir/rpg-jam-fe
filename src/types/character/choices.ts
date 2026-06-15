import { z } from "zod";

// The backend models a "choice" as a nested structure: a choice has one or more
// groups, each group has contents (the actual options). See docs/character_creator.md.

const groupIdSchema = z.object({ value: z.string() });

const groupContentSchema = z.object({
  id: groupIdSchema,
  type: z.string(),
  quantity: z.number(),
  referenceKey: z.string(),
});

const choiceGroupSchema = z.object({
  id: groupIdSchema,
  label: z.string(),
  groupContents: z.array(groupContentSchema),
});

export const choiceDetailSchema = z.object({
  id: groupIdSchema,
  numberOfChoices: z.number(),
  choiceGroups: z.array(choiceGroupSchema),
});

// A template's labelled sub-choice: { label: "Skill Proficiencies", choice }.
// All three templates (class/species/background) reuse this shape.
export const classChoiceSchema = z.object({
  label: z.string(),
  choice: choiceDetailSchema,
});

export const classFeatureSchema = z.object({
  key: z.string(),
  name: z.string(),
  levelRequirement: z.number(),
  description: z.string(),
  choice: choiceDetailSchema.optional(),
});

export type ChoiceDetail = z.infer<typeof choiceDetailSchema>;
export type ClassChoice = z.infer<typeof classChoiceSchema>;
