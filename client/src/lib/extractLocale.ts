import { LOCALES } from "./constants/locales";

const extractLocale = (url: string) => {
  const parsedUrl = new URL(url);
  const pathnameSegments = parsedUrl.pathname.split("/").filter(Boolean);

  const locale = LOCALES.includes(pathnameSegments[0])
    ? pathnameSegments[0]
    : null;
  return locale;
};

export default extractLocale;
