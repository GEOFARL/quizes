"use client";

import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import HighlightText from "@/components/utils/TextHighlight";
import { toast } from "@/hooks/use-toast";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  highlight: string;
  onUpdateCorrectAnswers: (correctAnswers: string[]) => void;
};

const FormSchema = z.object({
  items: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: "You have to select at least one item.",
  }),
});

const MultipleChoice: React.FC<Props> = ({
  question,
  highlight,
  onUpdateCorrectAnswers,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: question.correctAnswers,
    },
  });

  const handleToggle = useCallback((option: string, isChecked: boolean) => {
    const updatedAnswers = isChecked
      ? [...question.correctAnswers, option]
      : question.correctAnswers.filter((answer) => answer !== option);

    onUpdateCorrectAnswers(updatedAnswers);
  }, []);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }
  return (
    <div>
      <p className="font-semibold text-lg">
        <HighlightText text={question.question} highlight={highlight} />
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-2">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                {question.options?.map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item)}
                              onCheckedChange={(checked) => {
                                handleToggle(
                                  item,
                                  checked === "indeterminate" ? false : checked
                                );
                                return checked
                                  ? field.onChange([...field.value, item])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== item
                                      )
                                    );
                              }}
                            />
                          </FormControl>
                          <FormLabel>
                            <HighlightText text={item} highlight={highlight} />
                          </FormLabel>
                        </FormItem>
                      );
                    }}
                  />
                ))}
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default MultipleChoice;
