"use client";

import usePathWithLocale from "@/hooks/use-path-with-locale";
import { Dictionary } from "@/types/dictionary";
import Link from "next/link";

type Props = {
  quizName: string;
  translation: Dictionary;
};

const QuizHeader: React.FC<Props> = ({ quizName, translation }) => {
  const constructPath = usePathWithLocale();

  return (
    <div className="-mt-4">
      <h3 className="text-3xl text-center font-semibold text-black dark:text-white">
        {quizName}
      </h3>
      <div className="mt-2 text-center">
        <Link
          href={constructPath("/quizzes")}
          className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center justify-center"
        >
          {translation.home.questions.viewAllQuizzes || "View all my quizzes"}{" "}
          &rarr;
        </Link>
      </div>
    </div>
  );
};

export default QuizHeader;
