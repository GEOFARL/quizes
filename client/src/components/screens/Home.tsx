"use client";

import Dialog from "@/components/features/auth/Dialog";
import GenerateQuestions from "@/components/features/questions/generate/GenerateQuestions";
import Hero from "@/components/layout/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useCallback, useState } from "react";
import Questions from "../features/questions/Questions";
import Reviews from "../layout/Reviews";

type Props = {
  translation: Dictionary;
  user: string;
};

const HomeScreen: React.FC<Props> = ({ translation, user }) => {
  const [dialogData, setDialogData] =
    useState<GenerateQuestionsResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
                setDialogData(data);
                setIsDialogOpen(true);
              }}
              translation={translation}
              user={user}
              questions={dialogData?.questions ?? null}
              resetQuestions={() => setDialogData(null)}
              openQuestions={() => setIsDialogOpen(true)}
            />
          </CardContent>
        </Card>
      </section>

      <Reviews translation={translation} />

      {dialogData && (
        <Dialog
          title={translation.home.questions.title}
          description={translation.home.questions.description}
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          className="w-[90vw] md:max-w-[1200px] max-h-[85vh] overflow-auto"
        >
          <Questions questions={dialogData.questions} />
        </Dialog>
      )}
    </main>
  );
};

export default HomeScreen;
