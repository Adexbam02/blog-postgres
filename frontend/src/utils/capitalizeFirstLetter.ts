export function capitalizeFirstLetter(str: string) {
  if (str && typeof str === "string" && str.length > 0) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return str; // Return original value for empty strings or non-string inputs
}
