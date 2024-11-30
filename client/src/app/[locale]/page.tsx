"use client";

import Dialog from "@/components/features/auth/Dialog";
import GenerateQuestionsForm from "@/components/features/questions/GenerateQuestionsForm";
import Hero from "@/components/layout/Hero";
import { Card, CardContent } from "@/components/ui/card";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useCallback, useState } from "react";

const HomePage: React.FC = () => {
  const [dialogData, setDialogData] =
    useState<GenerateQuestionsResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setDialogData(null);
  }, []);

  return (
    <main className="flex flex-col space-y-10 mt-12">
      <Hero />

      <section className="mx-auto max-w-[1000px] px-4 md:px-8 w-full">
        <Card>
          <CardContent className="p-4 md:p-6">
            <GenerateQuestionsForm
              onSuccess={(data) => {
                setDialogData(data);
                setIsDialogOpen(true);
              }}
            />
          </CardContent>
        </Card>
      </section>

      {isDialogOpen && dialogData && (
        <Dialog
          title="Generated Questions"
          description="Here are the questions generated from your input:"
          open={isDialogOpen}
          onOpenChange={handleDialogClose}
          className="w-[90vw] md:max-w-[1200px] max-h-[85vh] overflow-auto"
        >
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
            {JSON.stringify(dialogData, null, 2)}
          </pre>
        </Dialog>
      )}
    </main>
  );
};

export default HomePage;
