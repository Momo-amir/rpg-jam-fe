export function formatReferenceKey(key: string): string {
  // Split on hyphens, then split each segment on PascalCase/camelCase boundaries
  return key
    .split("-")
    .flatMap((segment) => segment.split(/(?<=[a-z])(?=[A-Z])/))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/** D&D ability modifier: floor((score - 10) / 2). */
export function abilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/**
 * Level-1 max HP: the hit die's max value plus the Constitution modifier.
 * hitDie is the backend DiceSize string (e.g. "D10").
 */
export function deriveMaxHp(hitDie: string, constitution: number): number {
  return parseInt(hitDie.slice(1), 10) + abilityModifier(constitution);
}
