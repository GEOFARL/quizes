/**
 * Capitalizes the first letter of each word in a string, including Ukrainian and other languages.
 * @param text - The input string to capitalize.
 * @returns The capitalized string.
 */
const capitalize = (text: string): string => {
  return text
    .toLowerCase() // Convert the entire string to lowercase
    .replace(/(^|\s)\S/gu, (char) => char.toUpperCase()); // Capitalize the first letter after spaces or at the start
};

export default capitalize;
