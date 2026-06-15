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
  key: z.string(),
  name: z.string(),
  creatureType: z.string().optional(),
  speed: z.number().optional(),
  traits: z.array(z.string()).optional(),
  choices: z.array(classChoiceSchema).optional(),
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
  key: z.string(),
  name: z.string(),
  description: z.string().optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
  choices: z.array(classChoiceSchema).optional(),
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
  // No UI yet, sent as "" in the payload. TODO: add inputs to send real values for these.
  backstory: z.string().optional(),
  appearance: z.string().optional(),
  personality: z.string().optional(),
});

// ─── Create-character payload (backend Character entity shape) ─────────────────
// Enum-typed fields are plain strings: we send PascalCase member names and let the
// backend's JsonStringEnumConverter validate them.

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
  class: z.string(),
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
