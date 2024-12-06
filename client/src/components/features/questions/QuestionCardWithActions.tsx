import QuestionCard from "./QuestionCard";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { Dictionary } from "@/types/dictionary";
import SingleChoice from "./variants/SingleChoice";
import MultipleChoice from "./variants/MultipleChoice";
import TrueFalse from "./variants/TrueFalse";
import DeleteButton from "@/components/common/button/Delete";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  translation: Dictionary;
  highlight: string;
  onDelete?: (id: string) => void;
  onUpdateCorrectAnswers?: (id: string, correctAnswers: string[]) => void;
  onUpdateTitle?: (id: string, newTitle: string) => void;
  onUpdateOptions?: (id: string, newOptions: string[]) => void;
  onUpdateExplanation?: (id: string, newExplanation: string) => void;
};

const componentByType: Record<
  string,
  React.FC<{
    question: GenerateQuestionsResponse["questions"][number];
    onUpdateCorrectAnswers?: (correctAnswers: string[]) => void;
    onUpdateOptions?: (options: string[]) => void;
    onUpdateTitle?: (title: string) => void;
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
  onUpdateOptions,
  onUpdateTitle,
  onUpdateExplanation,
}) => {
  const Component = componentByType[question.type];
  return (
    <div className="relative">
      <QuestionCard
        question={question}
        translation={translation}
        highlight={highlight}
        onUpdateExplanation={
          onUpdateExplanation
            ? (explanation) => onUpdateExplanation(question.id, explanation)
            : undefined
        }
      >
        <Component
          question={question}
          highlight={highlight}
          onUpdateCorrectAnswers={
            onUpdateCorrectAnswers
              ? (correctAnswers) =>
                  onUpdateCorrectAnswers(question.id, correctAnswers)
              : undefined
          }
          onUpdateOptions={
            onUpdateOptions
              ? (options) => onUpdateOptions(question.id, options)
              : undefined
          }
          onUpdateTitle={
            onUpdateTitle
              ? (title) => onUpdateTitle(question.id, title)
              : undefined
          }
        />
      </QuestionCard>
      {onDelete && (
        <div className="absolute top-[6px] right-[6px]">
          <DeleteButton onClick={() => onDelete(question.id)} />
        </div>
      )}
    </div>
  );
};

export default QuestionCardWithActions;
