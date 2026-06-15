import { z } from "zod";

// ─── Shared enums ────────────────────────────────────────────────────────────

export const abilitySchema = z.enum([
  "Strength",
  "Dexterity",
  "Constitution",
  "Intelligence",
  "Wisdom",
  "Charisma",
]);

export const skillSchema = z.enum([
  "Acrobatics",
  "AnimalHandling",
  "Arcana",
  "Athletics",
  "Deception",
  "History",
  "Insight",
  "Intimidation",
  "Investigation",
  "Medicine",
  "Nature",
  "Perception",
  "Performance",
  "Persuasion",
  "Religion",
  "SleightOfHand",
  "Stealth",
  "Survival",
]);

export const weaponProficiencySchema = z.enum(["Simple", "Martial"]);

export const armorProficiencySchema = z.enum([
  "Light",
  "Medium",
  "Heavy",
  "Shield",
]);

export const diceTypeSchema = z.enum([
  "D4",
  "D6",
  "D8",
  "D10",
  "D12",
  "D20",
  "D100",
]);

// ─── API response shapes ──────────────────────────────────────────────────────

export const skillChoiceSchema = z.object({
  numberOfChoices: z.number(),
  options: z.array(z.string()),
});

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

const choiceDetailSchema = z.object({
  id: groupIdSchema,
  numberOfChoices: z.number(),
  choiceGroups: z.array(choiceGroupSchema),
});

const classFeatureSchema = z.object({
  key: z.string(),
  name: z.string(),
  levelRequirement: z.number(),
  description: z.string(),
  choice: choiceDetailSchema.optional(),
});

export const classChoiceSchema = z.object({
  label: z.string(),
  choice: choiceDetailSchema,
});

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

export const classListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string(),
  hitDie: diceTypeSchema,
  primaryAbilities: z.array(z.string()),
  weaponProficiency: z.array(z.string()),
  armorTraining: z.array(z.string()),
});

// ─── Species schemas ──────────────────────────────────────────────────────────

export const speciesListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  creatureType: z.string().optional(),
  traits: z.array(z.string()).optional(),
});

export const speciesTemplateSchema = z.object({
  id: groupIdSchema.optional(),
  key: z.string(),
  name: z.string(),
  creatureType: z.string().optional(),
  speed: z.number().optional(),
  traits: z.array(z.string()).optional(),
  size: choiceDetailSchema.nullable().optional(),
  lineage: choiceDetailSchema.nullable().optional(),
  skillful: choiceDetailSchema.nullable().optional(),
  versatile: choiceDetailSchema.nullable().optional(),
});

// ─── Background schemas ───────────────────────────────────────────────────────

export const backgroundListItemSchema = z.object({
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
});

export const backgroundTemplateSchema = z.object({
  id: groupIdSchema,
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
  ability: choiceDetailSchema.optional(),
  toolProficiencies: choiceDetailSchema.optional(),
  startingEquipment: choiceDetailSchema.optional(),
});

// ─── Saved character ─────────────────────────────────────────────────────────

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

// ─── Character builder form ───────────────────────────────────────────────────

export const abilityScoresSchema = z.object({
  strength: z.number().min(1).max(30),
  dexterity: z.number().min(1).max(30),
  constitution: z.number().min(1).max(30),
  intelligence: z.number().min(1).max(30),
  wisdom: z.number().min(1).max(30),
  charisma: z.number().min(1).max(30),
});

export const characterBuilderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  classId: z.string().min(1, "Class is required"),
  speciesId: z.string().min(1, "Species is required"),
  subspeciesId: z.string().optional(),
  backgroundId: z.string().min(1, "Background is required"),
  abilityScores: abilityScoresSchema,
  choices: z.record(z.string(), z.union([z.string(), z.array(z.string())])),
  alignment: z.string().optional(),
  pronouns: z.string().optional(),
  portraitUrl: z.string().optional(),
});
