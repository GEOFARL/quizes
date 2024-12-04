import { Dictionary } from "@/types/dictionary";
import { Quiz } from "@/types/quiz/quiz";
import QuizzesList from "../features/quizzes/QuizzesList";
import QuizzesHeader from "../features/quizzes/QuizzesHeader";

type Props = {
  translation: Dictionary;
  quizzes: Quiz[];
};

const Quizzes: React.FC<Props> = ({ quizzes, translation }) => {
  return (
    <main className="mb-4">
      <QuizzesHeader translation={translation} />
      <QuizzesList quizzes={quizzes.reverse()} translation={translation} />
    </main>
  );
};

export default Quizzes;
