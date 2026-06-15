const HEAVY_ARMOR_KEYS = ["chain-mail", "splint", "plate", "ring-mail"];
const MEDIUM_ARMOR_KEYS = [
  "chain-shirt",
  "scale-mail",
  "breastplate",
  "half-plate",
  "hide",
];
const LIGHT_ARMOR_KEYS = ["leather", "padded", "studded-leather-armor"];

/**
 * Level-1 Armor Class. If the character chose specific equipment, derive from the
 * armor in that equipment; otherwise fall back to the class's armor training tier.
 */
export function deriveAc(
  armorTraining: string[],
  dexMod: number,
  chosenEquipmentItems?: string[],
): number {
  if (chosenEquipmentItems) {
    if (
      chosenEquipmentItems.some((itemKey) => HEAVY_ARMOR_KEYS.includes(itemKey))
    )
      return 16;
    if (
      chosenEquipmentItems.some((itemKey) =>
        MEDIUM_ARMOR_KEYS.includes(itemKey),
      )
    )
      return 13 + Math.min(dexMod, 2);
    if (
      chosenEquipmentItems.some((itemKey) => LIGHT_ARMOR_KEYS.includes(itemKey))
    )
      return 12 + dexMod;
    return 10 + dexMod;
  }
  if (armorTraining.includes("Heavy")) return 16;
  if (armorTraining.includes("Medium")) return 13 + Math.min(dexMod, 2);
  if (armorTraining.includes("Light")) return 12 + dexMod;
  return 10 + dexMod;
}
