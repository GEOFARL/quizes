import { Button } from "@/components/ui/button";
import downloadPDFQuestionsPDF from "@/lib/downloadQuestionsPDF";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { usePathname } from "next/navigation";
import QuestionCard from "./QuestionCard";
import MultipleChoice from "./variants/MultipleChoice";
import SingleChoice from "./variants/SingleChoice";
import TrueFalse from "./variants/TrueFalse";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
};

const componentByType: Record<
  string,
  React.FC<{ question: GenerateQuestionsResponse["questions"][number] }>
> = {
  "single-choice": SingleChoice,
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
};

const Questions: React.FC<Props> = ({ questions, translation }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col space-y-6">
      {questions.map((question) => {
        const Component = componentByType[question.type];
        <Component question={question} />;
        return (
          <QuestionCard
            key={question.id}
            question={question}
            translation={translation}
          >
            <Component question={question} />
          </QuestionCard>
        );
      })}
      {pathname.split("/")[1] === "en" && (
        <div className="flex justify-end mb-4">
          <Button
            onClick={() => downloadPDFQuestionsPDF(translation, questions)}
          >
            {translation.home.questions.downloadPDF}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Questions;
