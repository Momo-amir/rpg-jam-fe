// Shared test fixtures mirroring the seeded fighter-template / species-human /
// background-soldier shapes returned by the backend. Used by build-payload and
// proficiencies tests so they exercise the same realistic data.
import type {
  CharacterBuilderFormValues,
  ClassTemplate,
  SpeciesTemplate,
  BackgroundTemplate,
} from "@/types/character";

export const fighter: ClassTemplate = {
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

export const human: SpeciesTemplate = {
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

// Gnome's Size is a fixed grant: numberOfChoices === 0 with a single always-taken
// option. There is nothing for the user to pick, so the builder must prefill it.
export const gnome: SpeciesTemplate = {
  key: "species-gnome",
  name: "Gnome",
  creatureType: "Humanoid",
  speed: 30,
  traits: ["Darkvision", "GnomishCunning", "GnomishLineage"],
  choices: [
    {
      label: "Size",
      choice: {
        id: { value: "gnome-size" },
        numberOfChoices: 0,
        choiceGroups: [
          {
            id: { value: "gsg" },
            label: "A",
            groupContents: [
              {
                id: { value: "gs1" },
                type: "Size",
                quantity: 1,
                referenceKey: "small",
              },
            ],
          },
        ],
      },
    },
    {
      label: "Lineage",
      choice: {
        id: { value: "gnome-lineage" },
        numberOfChoices: 1,
        choiceGroups: [
          {
            id: { value: "glg" },
            label: "A",
            groupContents: [
              {
                id: { value: "gl1" },
                type: "Trait",
                quantity: 1,
                referenceKey: "forest-gnome",
              },
              {
                id: { value: "gl2" },
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

export const soldier: BackgroundTemplate = {
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

export const form: CharacterBuilderFormValues = {
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
