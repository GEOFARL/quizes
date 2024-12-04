import { Dictionary } from "@/types/dictionary";
import { Quiz } from "@/types/quiz/quiz";
import QuizzesList from "../features/quizzes/QuizzesList";
import QuizzesHeader from "../features/quizzes/QuizzesHeader";
import { Pagination } from "@/types/pagination";

type Props = {
  translation: Dictionary;
  quizzes: Quiz[];
  pagination: Pagination;
};

const Quizzes: React.FC<Props> = ({ quizzes, translation, pagination }) => {
  return (
    <main className="mb-4">
      <QuizzesHeader translation={translation} />
      <QuizzesList
        quizzes={quizzes}
        pagination={pagination}
        translation={translation}
      />
    </main>
  );
};

export default Quizzes;
