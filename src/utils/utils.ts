// Utility to display a dash when data is not available or empty
export function displayOrDash(value: string | number | undefined | null): string {
  if (value === undefined || value === null || value === "") return "-";
  return String(value);
}
