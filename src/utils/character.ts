export function formatReferenceKey(key: string): string {
  // Split on hyphens, then split each segment on PascalCase/camelCase boundaries
  return key
    .split("-")
    .flatMap((segment) => segment.split(/(?<=[a-z])(?=[A-Z])/))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
