"use client";

import { questionsApi } from "@/api/questions-api";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { GenerateQuestionsPayload } from "@/types/questions/payload";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { generateQuestionsSchema } from "@/validations/generate-questions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type Props = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
};

const GenerateQuestionsForm: React.FC<Props> = ({ onSuccess }) => {
  const form = useForm<GenerateQuestionsPayload>({
    resolver: zodResolver(generateQuestionsSchema),
    defaultValues: {
      text: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: questionsApi.generateQuestions,
    onSuccess,
  });

  const onSubmit = useCallback(
    (values: GenerateQuestionsPayload) => {
      mutation.mutate(values);
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
                  <Textarea placeholder="Type your message here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-8">
            Send
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default GenerateQuestionsForm;
