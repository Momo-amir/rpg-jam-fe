// API keys sent by the backend mapped to human-readable display labels.
// Any string that identifies a feature/choice by name belongs here.

export const FEATURE_LABELS = {
  SKILL_PROFICIENCIES: "Skill Proficiencies",
  STARTING_EQUIPMENT: "Starting Equipment",
  SPELLCASTING: "Cantrips",
  FIGHTING_STYLE: "Fighting Style",
  WEAPON_MASTERY: "Weapon Mastery",
  TOOL_PROFICIENCY: "Tool Proficiencies",
  ABILITY_SCORE_IMPROVEMENT: "Ability",
} as const;

// Maps raw API feature names to display labels for normalize-choices.ts
export const FEATURE_LABEL_OVERRIDES: Record<string, string> = {
  Spellcasting: FEATURE_LABELS.SPELLCASTING,
  FightingStyle: FEATURE_LABELS.FIGHTING_STYLE,
  WeaponMastery: FEATURE_LABELS.WEAPON_MASTERY,
};
