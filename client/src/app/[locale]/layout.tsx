import Header from '@/components/layout/header';
import Providers from '@/components/providers';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { PropsWithChildren } from 'react';
import '../globals.css';
import { Locale } from '@/types/locale';
import BackgroundImage from '@/components/layout/BackgroundImage';
import { setLocale } from './dictionaries';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Quiz Generation App',
  description: 'Generate quizzes for your materials',
};

type Props = {
  params: Promise<{ locale: Locale }>;
} & PropsWithChildren;

const RootLayout: React.FC<Props> = async ({ children, params }) => {
  const { locale } = await params;
  setLocale(locale);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen max-w-screen`}
      >
        <Providers locale={locale}>
          <BackgroundImage />
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
