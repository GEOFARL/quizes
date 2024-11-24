export const replaceLocaleInUrl = (
  originalUrl: string,
  newLocale: string
): string => {
  const parts = originalUrl.split('/');
  if (parts.length > 1 && parts[1] !== '') {
    parts[1] = newLocale;
  }
  return parts.join('/');
};
