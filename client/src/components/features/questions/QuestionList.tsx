import { AnimatePresence, motion } from "framer-motion";
import QuestionCardWithActions from "./QuestionCardWithActions";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { Dictionary } from "@/types/dictionary";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  matches: number[];
  translation: Dictionary;
  highlight: string;
  onDelete: (id: string) => void;
};

const QuestionList: React.FC<Props> = ({
  questions,
  matches,
  translation,
  highlight,
  onDelete,
}) => {
  return (
    <AnimatePresence>
      {questions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5, rotate: -15, x: -200 }}
          transition={{ duration: 0.5 }}
          className={
            matches.includes(index) ? "border-l-4 border-yellow-500" : ""
          }
        >
          <QuestionCardWithActions
            question={question}
            translation={translation}
            highlight={highlight}
            onDelete={onDelete}
          />
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

export default QuestionList;
