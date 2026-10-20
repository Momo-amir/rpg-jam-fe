// One place for query keys, so invalidation always hits the right cache entries.
export const queryKeys = {
  me: ["me"] as const,
  characters: ["characters"] as const,
  classes: ["classes"] as const,
  classTemplate: (key: string) => ["classes", key] as const,
  species: ["species"] as const,
  speciesTemplate: (key: string) => ["species", key] as const,
  backgrounds: ["backgrounds"] as const,
  backgroundTemplate: (key: string) => ["backgrounds", key] as const,
};
