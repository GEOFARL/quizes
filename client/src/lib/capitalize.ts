/**
 * Capitalizes the first letter of each word in a string.
 * @param text - The input string to capitalize.
 * @returns The capitalized string.
 */
const capitalize = (text: string): string => {
  return text
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
};

export default capitalize;
