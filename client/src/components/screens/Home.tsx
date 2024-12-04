"use client";

import Dialog from "@/components/features/auth/Dialog";
import GenerateQuestions from "@/components/features/questions/generate/GenerateQuestions";
import Hero from "@/components/layout/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { useQuestions } from "@/hooks/questions/use-questions";
import { Dictionary } from "@/types/dictionary";
import { useCallback, useState } from "react";
import Questions from "../features/questions/Questions";
import Reviews from "../layout/Reviews";

type Props = {
  translation: Dictionary;
  user: string;
};

const HomeScreen: React.FC<Props> = ({ translation, user }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [quizName, setQuizName] = useState<string | null>(null);
  const {
    questions,
    setQuestions,
    deleteQuestion,
    updateCorrectAnswers,
    handleUpdateOptions,
    handleUpdateTitle,
    handleUpdateExplanation,
  } = useQuestions(null);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
  }, []);
  return (
    <main className="flex flex-col space-y-10 mt-12">
      <Hero translation={translation} />
      <section className="mx-auto max-w-[1000px] px-4 md:px-8 w-full">
        <Card>
          <CardContent className="p-4 md:p-6 relative space-y-2">
            <GenerateQuestions
              onSuccess={(data) => {
                setQuestions(data.questions);
                setIsDialogOpen(true);
              }}
              translation={translation}
              user={user}
              questions={questions}
              resetQuestions={() => setQuestions(null)}
              openQuestions={() => setIsDialogOpen(true)}
            />
          </CardContent>
        </Card>
      </section>

      <Reviews translation={translation} />

      {questions && (
        <Dialog
          title={!quizName ? translation.home.questions.title : ""}
          description={!quizName ? translation.home.questions.description : ""}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          className="w-[90vw] md:max-w-[1200px] max-h-[85vh] overflow-auto"
        >
          <Questions
            questions={questions}
            quizName={quizName}
            setQuizName={setQuizName}
            translation={translation}
            deleteQuestion={deleteQuestion}
            handleUpdateExplanation={handleUpdateExplanation}
            handleUpdateOptions={handleUpdateOptions}
            handleUpdateTitle={handleUpdateTitle}
            updateCorrectAnswers={updateCorrectAnswers}
          />
        </Dialog>
      )}
    </main>
  );
};

export default HomeScreen;
