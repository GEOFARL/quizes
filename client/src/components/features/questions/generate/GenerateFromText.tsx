"use client";

import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsPayload } from "@/types/questions/payload";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { generateQuestionsSchema } from "@/validations/generate-questions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import ManageQuestions from "./ManageQuestions";

type Props = {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  translation: Dictionary;
  questions: GenerateQuestionsResponse["questions"] | null;
  resetQuestions: () => void;
  openQuestions: () => void;
};

const GenerateFromText: React.FC<Props> = ({
  onSubmit,
  isLoading,
  translation,
  questions,
  openQuestions,
  resetQuestions,
}) => {
  const { user } = useUserContext();
  const form = useForm<GenerateQuestionsPayload>({
    resolver: zodResolver(generateQuestionsSchema),
    defaultValues: {
      text: "",
    },
    mode: "onSubmit",
  });

  const handleSubmit = useCallback(
    (values: GenerateQuestionsPayload) => {
      const formData = new FormData();
      formData.append("text", values.text);

      onSubmit(formData);
    },
    [onSubmit]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="space-y-2">
          <FormField
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder={
                      translation.home["generate-question-form"][
                        "input-placeholder"
                      ]
                    }
                    {...field}
                    className="resize-none"
                    minRows={15}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          {!questions ? (
            <Button
              type="submit"
              className="px-8"
              disabled={!user || isLoading || form.getValues().text === ""}
            >
              {isLoading
                ? translation.home["generate-question-form"]["button-loading"]
                : translation.home["generate-question-form"].button}
            </Button>
          ) : (
            <ManageQuestions
              resetQuestions={() => {
                form.reset();
                resetQuestions();
              }}
              openQuestions={openQuestions}
              translation={translation}
            />
          )}
        </div>
      </form>
    </Form>
  );
};

export default GenerateFromText;
