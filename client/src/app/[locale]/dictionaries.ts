import { Dictionary } from '@/types/dictionary';
import { Locale } from '@/types/locale';
import { cache } from 'react';

type DictionaryLoader = {
  [key in Locale]: () => Promise<Dictionary>;
};

const dictionaries: DictionaryLoader = {
  en: () =>
    import('../../../public/dictionaries/en.json').then(
      (module) => module.default
    ),
  uk: () =>
    import('../../../public/dictionaries/uk.json').then(
      (module) => module.default
    ),
};

export const getDictionary = async (locale: Locale): Promise<Dictionary> => {
  if (!dictionaries[locale]) {
    throw new Error(`Dictionary for locale ${locale} not found`);
  }
  return dictionaries[locale]();
};

const getStore = cache((): { value: Locale } => ({ value: 'en' }));

export const getLocale = (): Locale => getStore().value;
export const setLocale = (value: Locale) => {
  getStore().value = value;
};

export const getTranslation = () => getDictionary(getLocale());
