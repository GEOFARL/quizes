import { AnimatePresence } from "framer-motion";
import QuestionCardWithActions from "./QuestionCardWithActions";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { Dictionary } from "@/types/dictionary";
import Animated from "@/components/common/Animated";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  matches: number[];
  translation: Dictionary;
  highlight: string;
  onDelete?: (id: string) => void;
  onUpdateCorrectAnswers?: (id: string, correctAnswers: string[]) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onUpdateOptions?: (id: string, newOptions: string[]) => void;
  onUpdateExplanation?: (id: string, newExplanation: string) => void;
};

const QuestionList: React.FC<Props> = ({
  questions,
  matches,
  translation,
  highlight,
  onDelete,
  onUpdateCorrectAnswers,
  onUpdateTitle,
  onUpdateOptions,
  onUpdateExplanation,
}) => {
  return (
    <AnimatePresence>
      {questions.map((question, index) => (
        <Animated
          key={question.id}
          className={
            matches.includes(index) ? "border-l-4 border-yellow-500" : ""
          }
        >
          <QuestionCardWithActions
            question={question}
            translation={translation}
            highlight={highlight}
            onDelete={onDelete}
            onUpdateCorrectAnswers={onUpdateCorrectAnswers}
            onUpdateTitle={onUpdateTitle}
            onUpdateOptions={onUpdateOptions}
            onUpdateExplanation={onUpdateExplanation}
          />
        </Animated>
      ))}
    </AnimatePresence>
  );
};

export default QuestionList;
