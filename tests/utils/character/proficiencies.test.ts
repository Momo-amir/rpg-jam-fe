import { describe, expect, it } from "vitest";
import { aggregateProficiencies } from "@/utils/character/proficiencies";
import { fighter, human, soldier, form } from "./__fixtures__/character-templates";

describe("aggregateProficiencies", () => {
  const result = aggregateProficiencies(fighter, human, soldier, form.choices);
  const values = (items: { value: string }[]) => items.map((item) => item.value);

  it("gathers skills from the background, class choices, and dedupes overlaps", () => {
    const skills = values(result.skills);
    expect(skills).toContain("Athletics"); // background + class choice → one entry
    expect(skills).toContain("Intimidation"); // background fixed grant
    expect(skills).toContain("Acrobatics"); // class choice
    expect(skills.filter((skill) => skill === "Athletics")).toHaveLength(1);
  });

  it("attaches the granting source as the origin", () => {
    const athletics = result.skills.find((item) => item.value === "Athletics");
    // Athletics is deduped to its first occurrence — the background grant.
    expect(athletics?.origin).toBe("Soldier");
    const acrobatics = result.skills.find((item) => item.value === "Acrobatics");
    expect(acrobatics?.origin).toBe("Fighter");
  });

  it("lists class armor/weapon training plus chosen weapon masteries", () => {
    const armorAndWeapons = values(result.armorAndWeapons);
    expect(armorAndWeapons).toEqual([
      "Light",
      "Medium",
      "Heavy",
      "Shield",
      "Simple",
      "Martial",
      "Dagger", // chosen weapon mastery, formatted from "dagger"
    ]);
  });

  it("collects feats, the chosen tool, and passive species traits", () => {
    const featsAndTraits = values(result.featsAndTraits);
    expect(featsAndTraits).toContain("Savage Attacker"); // background fixed feat
    expect(featsAndTraits).toContain("Great Weapon Fighting"); // chosen fighting style
    expect(featsAndTraits).toContain("Dice"); // chosen tool proficiency
    expect(featsAndTraits).toContain("Resourceful"); // passive human trait
    // Skillful/Versatile grant further choices, so they aren't shown as passive traits.
    expect(featsAndTraits).not.toContain("Skillful");
    expect(featsAndTraits).not.toContain("Versatile");
  });

  it("returns empty groups when nothing is selected", () => {
    const empty = aggregateProficiencies(null, null, null, {});
    expect(empty.skills).toEqual([]);
    expect(empty.armorAndWeapons).toEqual([]);
    expect(empty.featsAndTraits).toEqual([]);
  });
});
