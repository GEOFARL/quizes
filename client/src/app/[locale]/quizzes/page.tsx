import { quizApi } from "@/api/quiz-api";
import Quizzes from "@/components/screens/Quizzes";
import { Token } from "@/lib/jwt/token";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { ServerCookieStorageStrategy } from "@/lib/storage/cookies/server";
import { User } from "@/lib/user/user";
import { Locale } from "@/types/locale";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDictionary } from "../dictionaries";

type Props = {
  params: Promise<{ locale: Locale }>;
};

const Page: React.FC<Props> = async ({ params }) => {
  const user = await User.fromCookies(await cookies());
  const { locale } = await params;
  const token = await new TokenStorage(
    new ServerCookieStorageStrategy().withCookies(await cookies())
  ).load();

  if (!user || !token || new Token(token).isExpired()) {
    redirect(`/${locale}/login`);
  }

  const { data: initialQuizzes, pagination } = await quizApi.getQuizzes(
    1,
    7,
    token
  );
  const translation = await getDictionary(locale);
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return (
    <Quizzes
      quizzes={initialQuizzes}
      pagination={pagination}
      translation={translation}
    />
  );
};

export default Page;
