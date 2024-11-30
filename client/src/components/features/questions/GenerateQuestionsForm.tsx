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
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsPayload } from "@/types/questions/payload";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { generateQuestionsSchema } from "@/validations/generate-questions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FileDropzone from "../../common/FileDropzone";

type Props = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  translation: Dictionary;
};

const GenerateQuestionsForm: React.FC<Props> = ({ onSuccess, translation }) => {
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

  const [isText, setIsText] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    console.log("SELECTED FILE", selectedFile);
  }, [selectedFile]);

  return (
    <div>
      <div className="absolute top-[4px] right-[4px] p-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-2 rounded-md shadow border-2 border-gray-300 dark:border-gray-600 z-10">
        <Label htmlFor="file-text" className="text-gray-700 dark:text-gray-300">
          {translation.home["generate-question-form"].switch}
        </Label>
        <Switch id="file-text" onCheckedChange={setIsText} />
      </div>
      {isText ? (
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
              <Button type="submit" className="px-8">
                {translation.home["generate-question-form"].button}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-2">
          <FileDropzone
            className="min-h-[325.25px]"
            accept={{
              "application/pdf": [".pdf"],
              "text/plain": [".txt"],
            }}
            multiple={false}
            onFilesChange={(files) => {
              setSelectedFile(files[0]);
            }}
            dropzoneText={{
              active: translation.home["generate-question-form"].dnd.active,
              default: translation.home["generate-question-form"].dnd.default,
              disabled: translation.home["generate-question-form"].dnd.disabled,
            }}
            translation={translation}
          />
          <div className="flex justify-end">
            <Button type="submit" className="px-8">
              {translation.home["generate-question-form"].button}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQuestionsForm;
