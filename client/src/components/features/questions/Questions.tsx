import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearch } from "@/hooks/use-search";
import downloadPDFQuestionsPDF from "@/lib/downloadQuestionsPDF";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import QuestionList from "./QuestionList";
import SaveQuizModal from "./quiz/SaveQuizModal";
import QuizHeader from "./quiz/QuizHeader";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
  quizName: string | null;
  setQuizName?: (name: string | null) => void;
  deleteQuestion?: (id: string) => void;
  updateCorrectAnswers?: (id: string, correctAnswers: string[]) => void;
  handleUpdateOptions?: (id: string, newOptions: string[]) => void;
  handleUpdateTitle?: (id: string, newTitle: string) => void;
  handleUpdateExplanation?: (id: string, newExplanation: string) => void;
};

const Questions: React.FC<Props> = ({
  questions,
  translation,
  quizName,
  setQuizName,
  deleteQuestion,
  updateCorrectAnswers,
  handleUpdateOptions,
  handleUpdateTitle,
  handleUpdateExplanation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSaveQuizModalOpen, setIsSaveQuizModalOpen] = useState(false);
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
      {quizName && <QuizHeader quizName={quizName} translation={translation} />}

      <div className="flex justify-between items-center space-y-2 sm:space-y-0 flex-col sm:flex-row">
        <Input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={
            translation.home.questions.searchPlaceholder || "Search..."
          }
          className="max-w-md"
        />
        <div className="space-x-2">
          {pathname.split("/")[1] === "en" && (
            <Button
              onClick={() => downloadPDFQuestionsPDF(translation, questions)}
            >
              {translation.home.questions.downloadPDF}
            </Button>
          )}
          {!quizName && (
            <Button onClick={() => setIsSaveQuizModalOpen(true)}>
              {translation.home.questions.saveQuiz || "Save Quiz"}
            </Button>
          )}
        </div>
      </div>

      <QuestionList
        questions={questions}
        matches={matches}
        translation={translation}
        highlight={debouncedSearchQuery}
        onDelete={deleteQuestion}
        onUpdateCorrectAnswers={updateCorrectAnswers}
        onUpdateOptions={handleUpdateOptions}
        onUpdateTitle={handleUpdateTitle}
        onUpdateExplanation={handleUpdateExplanation}
      />

      {setQuizName && (
        <SaveQuizModal
          questions={questions}
          onClose={() => setIsSaveQuizModalOpen(false)}
          isOpen={isSaveQuizModalOpen}
          updateQuizName={setQuizName}
          translation={translation}
        />
      )}
    </div>
  );
};

export default Questions;
