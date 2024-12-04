"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Quiz } from "@/types/quiz/quiz";
import Dialog from "../auth/Dialog";
import { Dictionary } from "@/types/dictionary";
import Questions from "../questions/Questions";
import MaxWidthWrapper from "@/components/utils/MaxWidthWrapper";
import { pluralizationRules, pluralize } from "@/lib/pluralize";

type QuizzesListProps = {
  quizzes: Quiz[];
  translation: Dictionary;
};

const QuizzesList: React.FC<QuizzesListProps> = ({ quizzes, translation }) => {
  const [openQuizId, setOpenQuizId] = useState<string | null>(null);

  const handleDialogClose = () => setOpenQuizId(null);

  return (
    <MaxWidthWrapper className="space-y-4 w-full">
      {quizzes.map((quiz) => (
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
    </MaxWidthWrapper>
  );
};

export default QuizzesList;
