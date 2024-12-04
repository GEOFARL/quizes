import { Dictionary } from "@/types/dictionary";
import { Locale } from "@/types/locale";
import { cache } from "react";

type DictionaryLoader = {
  [key in Locale]: () => Promise<Dictionary>;
};

const loadDictionary = async (lang: string): Promise<Dictionary> => {
  const home = await import(`../../../public/dictionaries/${lang}/home.json`);
  const global = await import(
    `../../../public/dictionaries/${lang}/global.json`
  );
  const auth = await import(`../../../public/dictionaries/${lang}/auth.json`);
  const quizzes = await import(
    `../../../public/dictionaries/${lang}/quizzes.json`
  );

  return {
    home: home.default,
    global: global.default,
    auth: auth.default,
    quizzes: quizzes.default,
  };
};

const dictionaries: DictionaryLoader = {
  en: () => loadDictionary("en"),
  uk: () => loadDictionary("uk"),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    throw new Error(`Dictionary for locale ${locale} not found`);
  }
  return dictionaries[locale]();
};

const getStore = cache((): { value: Locale } => ({ value: "en" }));

export const getLocale = (): Locale => getStore().value;
export const setLocale = (value: Locale) => {
  getStore().value = value;
};

export const getTranslation = () => getDictionary(getLocale());
