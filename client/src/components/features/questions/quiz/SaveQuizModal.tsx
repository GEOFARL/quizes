"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useSaveQuiz } from "@/hooks/quiz/use-save-quiz";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { saveQuizSchema } from "@/validations/save-quiz";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Dialog from "../../auth/Dialog";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  updateQuizName: (name: string) => void;
};

const SaveQuizModal: React.FC<Props> = ({
  questions,
  isOpen,
  onClose,
  translation,
  updateQuizName,
}) => {
  const { mutate, isPending } = useSaveQuiz();

  const form = useForm<z.infer<typeof saveQuizSchema>>({
    resolver: zodResolver(saveQuizSchema),
    defaultValues: { name: "", questions },
  });

  const handleSave = form.handleSubmit((data) => {
    mutate(data, { onSuccess: onClose });
    updateQuizName(data.name);
  });

  return (
    <Dialog
      title={translation.home.quiz.modal.title}
      description={translation.home.quiz.modal.description}
      open={isOpen}
      onOpenChange={onClose}
    >
      <Form {...form}>
        <form onSubmit={handleSave} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translation.home.quiz.modal.quizName}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      translation.home.quiz.modal.quizNamePlaceholder
                    }
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isPending}>
            {isPending
              ? translation.home.quiz.modal.saving
              : translation.home.quiz.modal.save}
          </Button>
        </form>
      </Form>
    </Dialog>
  );
};

export default SaveQuizModal;
