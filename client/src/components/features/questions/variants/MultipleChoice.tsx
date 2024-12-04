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
import EditTitle from "../edit/EditTitle";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import EditText from "../edit/EditText";
import useEditQuestion from "@/hooks/questions/use-edit-question";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  highlight: string;
  onUpdateCorrectAnswers?: (correctAnswers: string[]) => void;
  onUpdateOptions?: (options: string[]) => void;
  onUpdateTitle?: (newTitle: string) => void;
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
  onUpdateOptions,
  onUpdateTitle,
}) => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      items: question.correctAnswers,
    },
  });

  const handleToggle = useCallback(
    (option: string, isChecked: boolean) => {
      const updatedAnswers = isChecked
        ? [...question.correctAnswers, option]
        : question.correctAnswers.filter((answer) => answer !== option);

      onUpdateCorrectAnswers?.(updatedAnswers);
    },
    [question]
  );

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

  const {
    editingOptionIndex,
    handleSaveOption,
    setEditingOptionIndex,
    setTempOptions,
    tempOptions,
  } = useEditQuestion({
    question,
    onUpdateTitle,
    onUpdateOptions,
    onUpdateCorrectAnswers,
  });

  return (
    <div>
      <EditTitle
        onUpdateOptions={onUpdateOptions}
        onUpdateTitle={onUpdateTitle}
        onUpdateCorrectAnswers={onUpdateCorrectAnswers}
        question={question}
      >
        <p className="font-semibold text-lg">
          <HighlightText text={question.question} highlight={highlight} />
        </p>
      </EditTitle>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-2">
          <FormField
            control={form.control}
            name="items"
            render={() => (
              <FormItem>
                {tempOptions?.map((item, index) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="items"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={item}
                          className="flex flex-row items-center space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(
                                question.options?.[index] ?? ""
                              )}
                              onCheckedChange={(checked) => {
                                handleToggle(
                                  question.options?.[index] ?? "",
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

                          <div className="flex items-center space-x-2 w-full group">
                            {onUpdateOptions && editingOptionIndex === index ? (
                              <EditText
                                value={tempOptions[index]}
                                cancelEditing={() => {
                                  setEditingOptionIndex(null);
                                  setTempOptions((prev) =>
                                    prev.map((opt, i) =>
                                      i === index
                                        ? question.options?.[i] ?? ""
                                        : opt
                                    )
                                  );
                                }}
                                save={() => {
                                  const newItems = form
                                    .getValues("items")
                                    .map((opt) =>
                                      opt === question.options?.[index]
                                        ? tempOptions[index]
                                        : opt
                                    );

                                  form.setValue("items", newItems);
                                  handleSaveOption(index);
                                }}
                                updateValue={(newValue: string) => {
                                  setTempOptions((prev) =>
                                    prev.map((opt, i) =>
                                      i === index ? newValue : opt
                                    )
                                  );
                                }}
                              />
                            ) : (
                              <div className="flex items-center space-x-2 relative">
                                <FormLabel>
                                  <HighlightText
                                    text={question.options?.[index] ?? ""}
                                    highlight={highlight}
                                  />
                                </FormLabel>
                                {onUpdateOptions && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingOptionIndex(index)}
                                    className="opacity-0 group-hover:opacity-100 absolute right-[-24px] top-[-8px] [&_svg]:size-3 p-1 h-[20px] w-[20px]"
                                  >
                                    <Edit />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
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
