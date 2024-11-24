import { PropsWithChildren } from 'react';
import ThemeProvider from './ThemeProvider';
import { TranslationProvider } from './TranslationProvider';
import { Locale } from '@/types/locale';

type Props = { locale: Locale } & PropsWithChildren;

const Providers: React.FC<Props> = async ({ children, locale }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <TranslationProvider locale={locale}>{children}</TranslationProvider>
    </ThemeProvider>
  );
};

export default Providers;
