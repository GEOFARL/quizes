import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import QuestionCard from "./QuestionCard";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { Dictionary } from "@/types/dictionary";
import SingleChoice from "./variants/SingleChoice";
import MultipleChoice from "./variants/MultipleChoice";
import TrueFalse from "./variants/TrueFalse";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  translation: Dictionary;
  highlight: string;
  onDelete: (id: string) => void;
  onUpdateCorrectAnswers: (id: string, correctAnswers: string[]) => void;
};

const componentByType: Record<
  string,
  React.FC<{
    question: GenerateQuestionsResponse["questions"][number];
    onUpdateCorrectAnswers: (correctAnswers: string[]) => void;
    highlight: string;
  }>
> = {
  "single-choice": SingleChoice,
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
};

const QuestionCardWithActions: React.FC<Props> = ({
  question,
  translation,
  highlight,
  onDelete,
  onUpdateCorrectAnswers,
}) => {
  const Component = componentByType[question.type];
  return (
    <div className="relative">
      <QuestionCard
        question={question}
        translation={translation}
        highlight={highlight}
      >
        <Component
          question={question}
          highlight={highlight}
          onUpdateCorrectAnswers={(correctAnswers) =>
            onUpdateCorrectAnswers(question.id, correctAnswers)
          }
        />
      </QuestionCard>
      <div className="absolute top-[8px] right-[8px]">
        <Button
          variant="destructive"
          className="px-3 py-2"
          onClick={() => onDelete(question.id)}
        >
          <Trash />
        </Button>
      </div>
    </div>
  );
};

export default QuestionCardWithActions;
