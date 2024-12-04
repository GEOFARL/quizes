import QuizzesHeader from "@/components/features/quizzes/QuizzesHeader";
import QuizzesSkeleton from "@/components/features/quizzes/QuizzesSkeleton";
import { getDictionary } from "../dictionaries";
import { headers } from "next/headers";
import extractLocale from "@/lib/extractLocale";
import { Locale } from "@/types/locale";

const Loading: React.FC = async () => {
  const URL = (await headers()).get("x-url") || "";
  const translation = await getDictionary(
    (extractLocale(URL) ?? "en") as Locale
  );
  return (
    <>
      <QuizzesHeader translation={translation} />
      <QuizzesSkeleton />
    </>
  );
};

export default Loading;
