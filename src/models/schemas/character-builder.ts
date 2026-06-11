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

// ─── Class choice sub-types ───────────────────────────────────────────────────

export const fightingStyleTypeSchema = z.enum([
  "Archery",
  "Defense",
  "Dueling",
  "GreatWeaponFighting",
  "Protection",
  "TwoWeaponFighting",
]);

export const weaponMasteryTypeSchema = z.enum([
  "Longsword",
  "Shortsword",
  "Greatsword",
  "Quarterstaff",
  "Battleaxe",
  "Warhammer",
  "Handaxe",
  "LightCrossbow",
  "Longbow",
]);

// ─── API response shapes ──────────────────────────────────────────────────────

export const skillChoiceSchema = z.object({
  numberOfChoices: z.number(),
  options: z.array(z.string()),
});

const equipmentOptionSchema = z.object({
  label: z.string(),
  optionGroup: z.array(z.string()),
});

const startingEquipmentSchema = z.object({
  numberOfChoices: z.number(),
  options: z.array(equipmentOptionSchema),
});

const classFeatureSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  numberOfChoices: z.number(),
  options: z.union([z.array(z.unknown()), z.string()]).optional(),
});

export const classChoiceSchema = z.object({
  skillProficiencies: skillChoiceSchema,
  startingEquipment: startingEquipmentSchema,
  classFeatures: z.array(classFeatureSchema),
});

export const classTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  hitDie: z.number(),
  primaryAbilities: z.array(z.string()),
  savingThrowProficiencies: z.array(z.string()),
  weaponProficiencies: z.array(z.string()),
  armorTraining: z.array(z.string()),
  choices: z.array(classChoiceSchema),
});

export const classListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  hitDie: z.number(),
  primaryAbilities: z.array(z.string()),
  armorTraining: z.array(z.string()),
});

// ─── Species schemas ──────────────────────────────────────────────────────────

const specialTraitSchema = z.object({
  name: z.string(),
  description: z.string(),
  numberOfChoices: z.number(),
  options: z.array(z.string()),
});

const speciesChoiceSchema = z.object({
  size: z.object({
    numberOfChoices: z.number(),
    options: z.array(z.string()),
  }),
  specialTraits: z.array(specialTraitSchema),
});

export const speciesTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string().optional(),
  speed: z.string().optional(),
  choices: z.array(speciesChoiceSchema).optional(),
});

// ─── Background schemas ───────────────────────────────────────────────────────

const backgroundEquipmentOptionSchema = z.object({
  label: z.string(),
  optionGroup: z.array(z.string()),
});

const backgroundChoiceSchema = z.object({
  toolProficiency: z
    .object({
      numberOfChoices: z.number(),
      options: z.array(z.string()),
    })
    .optional(),
  startingEquipment: z
    .object({
      numberOfChoices: z.number(),
      options: z.array(backgroundEquipmentOptionSchema),
    })
    .optional(),
});

export const backgroundTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  abilityScores: z.array(z.string()).optional(),
  feat: z.string().optional(),
  skillProficiencies: z.array(z.string()).optional(),
  choices: z.array(backgroundChoiceSchema).optional(),
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
  proficiencies: z.array(z.string()),
  alignment: z.string().optional(),
  pronouns: z.string().optional(),
  portraitUrl: z.string().optional(),
});
