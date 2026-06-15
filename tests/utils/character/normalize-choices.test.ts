import { describe, expect, it } from "vitest";
import { normalizeSpeciesChoices } from "@/utils/character/normalize-choices";
import { gnome, human } from "./__fixtures__/character-templates";

describe("normalizeSpeciesChoices", () => {
  it("prefills a fixed grant (numberOfChoices === 0) with its single option", () => {
    const choices = normalizeSpeciesChoices(gnome);
    const size = choices.find((choice) => choice.key === "gnome-size");

    expect(size).toBeDefined();
    expect(size?.numberOfChoices).toBe(0);
    expect(size?.prefilledValue).toBe("small");
  });

  it("does not prefill a real user choice (numberOfChoices > 1 options)", () => {
    const choices = normalizeSpeciesChoices(human);
    const size = choices.find((choice) => choice.key === "human-size");

    expect(size?.prefilledValue).toBeUndefined();
  });
});
