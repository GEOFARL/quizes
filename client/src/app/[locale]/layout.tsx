import BackgroundImage from "@/components/layout/BackgroundImage";
import Header from "@/components/layout/header";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/toaster";
import { Locale } from "@/types/locale";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import "../globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Quiz Generation App",
  description: "Generate quizzes for your materials",
};

type Props = {
  params: Promise<{ locale: Locale }>;
  auth: React.ReactNode;
} & PropsWithChildren;

const RootLayout: React.FC<Props> = async ({ children, auth, params }) => {
  const { locale } = await params;
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} antialiased flex flex-col min-h-screen max-w-screen`}
      >
        <Providers locale={locale}>
          <BackgroundImage />
          <Header locale={locale} />
          <Toaster />
          {auth}
          {children}
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
