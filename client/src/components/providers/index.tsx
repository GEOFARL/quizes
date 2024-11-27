"use client";

import { Locale } from "@/types/locale";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import ThemeProvider from "./ThemeProvider";
import { TranslationProvider } from "./TranslationProvider";
import { UserProvider } from "./UserProvider";

type Props = { locale: Locale } & PropsWithChildren;

const queryClient = new QueryClient();

const Providers: React.FC<Props> = ({ children, locale }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <TranslationProvider locale={locale}>
          <UserProvider>{children}</UserProvider>
        </TranslationProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default Providers;
