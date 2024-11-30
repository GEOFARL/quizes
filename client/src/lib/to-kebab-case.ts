/**
 * Converts a given text into kebab-case format.
 * @param text - The input string to be converted.
 * @returns The kebab-case formatted string.
 */
const toKebabCase = (text: string): string => {
  return text
    .trim() // Remove leading and trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9\s]/g, "") // Remove non-alphanumeric characters
    .replace(/\s+/g, "-"); // Replace spaces with hyphens
};

export default toKebabCase;
