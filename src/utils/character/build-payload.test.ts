import { describe, expect, it } from "vitest";
import { buildCreateCharacterPayload } from "./build-payload";
import { fighter, human, soldier, form } from "./__fixtures__/character-templates";

describe("buildCreateCharacterPayload", () => {
  const payload = buildCreateCharacterPayload(form, {
    classTemplate: fighter,
    speciesTemplate: human,
    backgroundTemplate: soldier,
    derivedHp: 12,
    derivedAc: 16,
  });

  it("emits backend enum values verbatim for API-sourced fields", () => {
    expect(payload.class).toBe("Fighter");
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
