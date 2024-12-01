"use client";

import { questionsApi } from "@/api/questions-api";
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
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  translation: Dictionary;
};

const GenerateFromText: React.FC<Props> = ({ onSuccess, translation }) => {
  const { user } = useUserContext();
  const form = useForm<GenerateQuestionsPayload>({
    resolver: zodResolver(generateQuestionsSchema),
    defaultValues: {
      text: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: questionsApi.generateQuestions,
    onSuccess: (data) => {
      console.log("Generated questions:", data);
      onSuccess?.(data);
    },
  });

  const onSubmit = useCallback(
    (values: GenerateQuestionsPayload) => {
      const formData = new FormData();
      formData.append("text", values.text);

      mutation.mutate(formData);
      form.reset();
    },
    [form, mutation]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          <Button
            type="submit"
            className="px-8"
            disabled={!user || mutation.isPending}
          >
            {mutation.isPending
              ? translation.home["generate-question-form"]["button-loading"]
              : translation.home["generate-question-form"].button}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GenerateFromText;
