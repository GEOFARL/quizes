import QuestionList from "./QuestionList";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import downloadPDFQuestionsPDF from "@/lib/downloadQuestionsPDF";
import { usePathname } from "next/navigation";
import { useQuestions } from "@/hooks/questions/use-questions";
import { useCallback, useState } from "react";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
};

const Questions: React.FC<Props> = ({
  questions: initialQuestions,
  translation,
}) => {
  const { questions, deleteQuestion, updateCorrectAnswers } =
    useQuestions(initialQuestions);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const pathname = usePathname();

  const generateSearchableContent = useCallback(
    (question: GenerateQuestionsResponse["questions"][number]) =>
      `${question.question} ${question.options?.join(" ") || ""} ${
        question.explanation || ""
      }`,
    []
  );

  const matches = useSearch(
    questions,
    debouncedSearchQuery,
    generateSearchableContent
  );

  return (
    <div className="flex flex-col space-y-6">
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            translation.home.questions.searchPlaceholder || "Search..."
          }
          className="max-w-md"
        />
        {pathname.split("/")[1] === "en" && (
          <Button
            onClick={() => downloadPDFQuestionsPDF(translation, questions)}
          >
            {translation.home.questions.downloadPDF}
          </Button>
        )}
      </div>

      <QuestionList
        questions={questions}
        matches={matches}
        translation={translation}
        highlight={debouncedSearchQuery}
        onDelete={deleteQuestion}
        onUpdateCorrectAnswers={updateCorrectAnswers}
      />
    </div>
  );
};

export default Questions;
