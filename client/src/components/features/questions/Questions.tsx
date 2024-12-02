import { useState, useRef, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import downloadPDFQuestionsPDF from "@/lib/downloadQuestionsPDF";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { usePathname } from "next/navigation";
import QuestionCard from "./QuestionCard";
import MultipleChoice from "./variants/MultipleChoice";
import SingleChoice from "./variants/SingleChoice";
import TrueFalse from "./variants/TrueFalse";
import { useSearch } from "@/hooks/use-search";
import { useDebounce } from "@/hooks/use-debounce";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
};

const componentByType: Record<
  string,
  React.FC<{
    question: GenerateQuestionsResponse["questions"][number];
    highlight: string;
  }>
> = {
  "single-choice": SingleChoice,
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
};

const Questions: React.FC<Props> = ({ questions, translation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const pathname = usePathname();
  const questionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const getSearchableContent = (
    question: GenerateQuestionsResponse["questions"][number]
  ) =>
    `${question.question} ${question.options?.join(" ") || ""} ${
      question.explanation || ""
    }`;

  useEffect(() => {
    questionRefs.current = questionRefs.current.slice(0, questions.length);
  }, [questions]);

  const matches = useSearch(
    questions,
    debouncedSearchQuery,
    useMemo(() => getSearchableContent, [])
  );

  useEffect(() => {
    if (matches.length > 0) {
      const firstMatchRef = questionRefs.current[matches[0]];
      if (firstMatchRef) {
        setTimeout(() => {
          firstMatchRef.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 0);
      }
    }
  }, [matches]);

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

      {questions.map((question, index) => {
        const Component = componentByType[question.type];
        const isMatched = matches.includes(index);

        return (
          <div
            key={question.id}
            ref={(el) => {
              questionRefs.current[index] = el;
            }}
            className={isMatched ? "border-l-4 border-yellow-500" : ""}
          >
            <QuestionCard
              question={question}
              translation={translation}
              highlight={debouncedSearchQuery}
            >
              <Component question={question} highlight={debouncedSearchQuery} />
            </QuestionCard>
          </div>
        );
      })}
    </div>
  );
};

export default Questions;
