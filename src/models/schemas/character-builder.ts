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
  options: z.array(skillSchema),
});

const fightingStyleChoiceSchema = z.object({
  type: z.literal("FightingStyle"),
  label: z.string(),
  numberOfChoices: z.number(),
  options: z.array(fightingStyleTypeSchema),
});

const weaponMasteryChoiceSchema = z.object({
  type: z.literal("WeaponMastery"),
  label: z.string(),
  numberOfChoices: z.number(),
  options: z.array(weaponMasteryTypeSchema),
});

export const classChoiceSchema = z.discriminatedUnion("type", [
  fightingStyleChoiceSchema,
  weaponMasteryChoiceSchema,
]);

export const classTemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  hitDice: diceTypeSchema,
  primaryAbilities: z.array(abilitySchema),
  savingThrow: z.array(abilitySchema),
  skillChoice: skillChoiceSchema,
  classChoice: z.array(classChoiceSchema),
  weaponSkill: z.array(weaponProficiencySchema),
  armorSkill: z.array(armorProficiencySchema),
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

