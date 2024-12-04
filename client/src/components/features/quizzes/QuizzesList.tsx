"use client";

import PaginationComponent from "@/components/common/Pagination";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MaxWidthWrapper from "@/components/utils/MaxWidthWrapper";
import useQuizzes from "@/hooks/quiz/use-quizzes";
import { pluralizationRules, pluralize } from "@/lib/pluralize";
import { Dictionary } from "@/types/dictionary";
import { Pagination as PaginationType } from "@/types/pagination";
import { Quiz } from "@/types/quiz/quiz";
import { useState } from "react";
import Dialog from "../auth/Dialog";
import Questions from "../questions/Questions";

type QuizzesListProps = {
  quizzes: Quiz[];
  translation: Dictionary;
  pagination: PaginationType;
};

const QuizzesList: React.FC<QuizzesListProps> = ({
  quizzes,
  translation,
  pagination,
}) => {
  const [openQuizId, setOpenQuizId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(pagination.page);
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const { data, isLoading } = useQuizzes(currentPage, pagination.limit, {
    data: quizzes,
    pagination,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDialogClose = () => setOpenQuizId(null);

  return (
    <MaxWidthWrapper className="space-y-4 w-full">
      {(isLoading ? quizzes : data?.data ?? []).map((quiz) => (
        <Card key={quiz.id} className="w-full shadow-md border rounded-lg">
          <CardHeader className="p-4">
            <CardTitle className="text-xl font-semibold">{quiz.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                {pluralize(
                  quiz.questions.length,
                  "quizzes.card.questionsForms",
                  translation,
                  pluralizationRules
                )}
              </p>

              <Button
                onClick={() => {
                  setOpenQuizId(quiz.id);
                }}
              >
                {translation.quizzes.card.viewQuestions}
              </Button>
            </div>
          </CardContent>

          {openQuizId === quiz.id && (
            <Dialog
              open={openQuizId === quiz.id}
              onOpenChange={handleDialogClose}
              className="w-[90vw] md:max-w-[1200px] max-h-[85vh] overflow-auto"
            >
              <Questions
                questions={quiz.questions}
                quizName={quiz.name}
                translation={translation}
              />
            </Dialog>
          )}
        </Card>
      ))}

      <PaginationComponent
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </MaxWidthWrapper>
  );
};

export default QuizzesList;
