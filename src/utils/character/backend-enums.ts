export function toPascalCase(value: string): string {
  return value
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

/** Maps a list of reference keys / display strings to PascalCase enum names. */
export function toPascalCaseList(values: string[]): string[] {
  return values.map(toPascalCase);
}
