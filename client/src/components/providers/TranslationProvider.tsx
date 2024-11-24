'use client';

import { getDictionary } from '@/app/[locale]/dictionaries';
import { Dictionary } from '@/types/dictionary';
import { Locale } from '@/types/locale';
import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useState,
} from 'react';

const TranslationContext = createContext<Dictionary | null>(null);

type Props = {
  locale: Locale;
} & PropsWithChildren;

export const TranslationProvider: React.FC<Props> = ({ children, locale }) => {
  const [translation, setTranslation] = useState<Dictionary | null>(null);

  useEffect(() => {
    getDictionary(locale).then(setTranslation);
  }, [locale]);

  return (
    <TranslationContext.Provider value={translation}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = (): Dictionary | null => {
  return use(TranslationContext);
};
