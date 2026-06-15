import { describe, expect, it } from "vitest";
import { buildCreateCharacterPayload } from "./build-payload";
import type {
  CharacterBuilderFormValues,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/models/types/character-builder.types";

// Mirrors the seeded fighter-template / species-human / background-soldier shapes.
const fighter: ClassTemplate = {
  key: "fighter-template",
  name: "Fighter",
  description: "",
  hitDie: "D10",
  primaryAbilities: ["Strength"],
  weaponProficiency: ["Simple", "Martial"],
  armorTraining: ["Light", "Medium", "Heavy", "Shield"],
  classFeatures: [
    {
      key: "fighting-style",
      name: "FightingStyle",
      levelRequirement: 1,
      description: "",
      // Fighting styles are Feats in the seed data.
      choice: {
        id: { value: "fighting-style" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "fs" },
            label: "A",
            groupContents: [
              {
                id: { value: "f1" },
                type: "Feat",
                quantity: 1,
                referenceKey: "great-weapon-fighting",
              },
              {
                id: { value: "f2" },
                type: "Feat",
                quantity: 1,
                referenceKey: "dueling",
              },
            ],
          },
        ],
      },
    },
    {
      key: "weapon-mastery",
      name: "WeaponMastery",
      levelRequirement: 1,
      description: "",
      choice: {
        id: { value: "weapon-mastery" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "wm" },
            label: "A",
            groupContents: [
              {
                id: { value: "w1" },
                type: "WeaponMastery",
                quantity: 1,
                referenceKey: "dagger",
              },
              {
                id: { value: "w2" },
                type: "WeaponMastery",
                quantity: 1,
                referenceKey: "greatclub",
              },
            ],
          },
        ],
      },
    },
  ],
  choices: [
    {
      label: "Skill Proficiencies",
      choice: {
        id: { value: "fighter-skills" },
        numberOfChoices: 2,
        choiceGroups: [
          {
            id: { value: "g1" },
            label: "A",
            groupContents: [
              {
                id: { value: "o1" },
                type: "SkillProficiency",
                quantity: 1,
                referenceKey: "acrobatics",
              },
              {
                id: { value: "o2" },
                type: "SkillProficiency",
                quantity: 1,
                referenceKey: "animal-handling",
              },
              {
                id: { value: "o3" },
                type: "SkillProficiency",
                quantity: 1,
                referenceKey: "athletics",
              },
            ],
          },
        ],
      },
    },
    {
      label: "Starting Equipment",
      choice: {
        id: { value: "fighter-equipment" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "eq-a" },
            label: "A",
            groupContents: [
              { id: { value: "e1" }, type: "Item", quantity: 1, referenceKey: "chain-mail" },
              { id: { value: "e2" }, type: "Item", quantity: 8, referenceKey: "javelin" },
              { id: { value: "e3" }, type: "Currency", quantity: 4, referenceKey: "gold" },
            ],
          },
          {
            id: { value: "eq-b" },
            label: "B",
            groupContents: [
              { id: { value: "e4" }, type: "Item", quantity: 1, referenceKey: "leather" },
            ],
          },
        ],
      },
    },
  ],
};

const human: SpeciesTemplate = {
  key: "species-human",
  name: "Human",
  creatureType: "Humanoid",
  speed: 30,
  traits: ["Resourceful", "Skillful", "Versatile"],
  choices: [
    {
      label: "Size",
      choice: {
        id: { value: "human-size" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "sg" },
            label: "A",
            groupContents: [
              {
                id: { value: "s1" },
                type: "Size",
                quantity: 1,
                referenceKey: "small",
              },
              {
                id: { value: "s2" },
                type: "Size",
                quantity: 1,
                referenceKey: "medium",
              },
            ],
          },
        ],
      },
    },
    {
      label: "Lineage",
      choice: {
        id: { value: "human-lineage" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "lg" },
            label: "A",
            groupContents: [
              {
                id: { value: "l1" },
                type: "Trait",
                quantity: 1,
                referenceKey: "forest-gnome",
              },
              {
                id: { value: "l2" },
                type: "Trait",
                quantity: 1,
                referenceKey: "rock-gnome",
              },
            ],
          },
        ],
      },
    },
  ],
};

const soldier: BackgroundTemplate = {
  key: "background-soldier",
  name: "Soldier",
  description: "",
  feat: "SavageAttacker",
  skillProficiencies: ["Athletics", "Intimidation"],
  choices: [
    {
      // The tool proficiency choice's options are typed "Item", not "ToolProficiency".
      label: "Tool Proficiencies",
      choice: {
        id: { value: "soldier-tools" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "tg" },
            label: "A",
            groupContents: [
              { id: { value: "t1" }, type: "Item", quantity: 1, referenceKey: "Dice" },
              { id: { value: "t2" }, type: "Item", quantity: 1, referenceKey: "Cards" },
            ],
          },
        ],
      },
    },
  ],
};

const form: CharacterBuilderFormValues = {
  name: "Aragorn",
  classId: "fighter-template",
  speciesId: "species-human",
  backgroundId: "background-soldier",
  abilityScores: {
    strength: 15,
    dexterity: 12,
    constitution: 14,
    intelligence: 10,
    wisdom: 13,
    charisma: 8,
  },
  choices: {
    "fighter-skills": ["acrobatics", "athletics"],
    "human-size": "medium",
    "human-lineage": "forest-gnome",
    "fighting-style": "great-weapon-fighting",
    "weapon-mastery": "dagger",
    "soldier-tools": "Dice",
    "fighter-equipment": "eq-a",
  },
  alignment: "LawfulGood",
  pronouns: "HeHim",
};

describe("buildCreateCharacterPayload", () => {
  const payload = buildCreateCharacterPayload(form, {
    classTemplate: fighter,
    speciesTemplate: human,
    backgroundTemplate: soldier,
    derivedHp: 12,
    derivedAc: 16,
  });

  it("emits backend enum values verbatim for API-sourced fields", () => {
    expect(payload.class.class).toBe("Fighter");
    expect(payload.background).toBe("Soldier");
    expect(payload.speciesTraits.creatureType).toBe("Humanoid");
  });

  it("passes through alignment/pronouns enum values without conversion", () => {
    expect(payload.details.alignment).toBe("LawfulGood");
    expect(payload.details.pronouns).toBe("HeHim");
    expect(payload.details.name).toBe("Aragorn");
  });

  it("converts kebab-case reference keys to PascalCase enum names", () => {
    expect(payload.proficiencies.skills).toContain("Acrobatics");
    expect(payload.proficiencies.skills).toContain("Athletics");
    expect(payload.proficiencies.skills).toContain("Intimidation"); // background fixed grant
    expect(payload.speciesTraits.size).toBe("Medium");
  });

  it("passes through proficiencies already in backend form", () => {
    expect(payload.proficiencies.weapons).toEqual(["Simple", "Martial"]);
    expect(payload.proficiencies.armors).toEqual([
      "Light",
      "Medium",
      "Heavy",
      "Shield",
    ]);
  });

  it("resolves the background tool proficiency (typed Item) by label", () => {
    expect(payload.proficiencies.tools).toEqual(["Dice"]);
  });

  it("sends the derived armor class", () => {
    expect(payload.armorClass).toBe(16);
  });

  it("resolves the chosen starting equipment bundle with quantities and types", () => {
    expect(payload.startingEquipment).toEqual([
      { referenceKey: "ChainMail", quantity: 1, type: "Item" },
      { referenceKey: "Javelin", quantity: 8, type: "Item" },
      { referenceKey: "Gold", quantity: 4, type: "Currency" },
    ]);
  });

  it("dedupes skills (Athletics from both class choice and background)", () => {
    const athletics = payload.proficiencies.skills.filter(
      (skill) => skill === "Athletics",
    );
    expect(athletics).toHaveLength(1);
  });

  it("groups typed selections into their own lists, PascalCased", () => {
    expect(payload.classFeatures).toEqual(["FightingStyle", "WeaponMastery"]);
    // SavageAttacker from the background's fixed feat + GreatWeaponFighting (the chosen fighting style).
    expect(payload.feats).toEqual(["SavageAttacker", "GreatWeaponFighting"]);
    expect(payload.weaponMasteries).toEqual(["Dagger"]);
    expect(payload.speciesTraits.lineage).toBe("ForestGnome");
  });

  it("omits empty optional lists (Fighter has no cantrips/spells)", () => {
    expect(payload).not.toHaveProperty("cantrips");
    expect(payload).not.toHaveProperty("spells");
  });

  it("maps the nested shape with abilities and hit points", () => {
    expect(payload.level).toBe(1);
    expect(payload.abilities.strength).toBe(15);
    expect(payload.hitPoints.max).toBe(12);
    expect(payload.hitPoints.hitDice).toBe("D10");
  });

  it("omits runtime-only hit point fields", () => {
    expect(payload.hitPoints).not.toHaveProperty("current");
    expect(payload.hitPoints).not.toHaveProperty("temp");
    expect(payload.hitPoints).not.toHaveProperty("spentDice");
    expect(payload.hitPoints).not.toHaveProperty("maxDice");
    expect(payload.hitPoints).not.toHaveProperty("deathSaves");
  });
});
