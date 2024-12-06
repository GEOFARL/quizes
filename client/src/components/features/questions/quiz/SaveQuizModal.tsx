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
import { Category } from "@/types/quiz/category";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  categories: Category[];
  translation: Dictionary;
  isOpen: boolean;
  onClose: () => void;
  updateQuizName: (name: string) => void;
};

const SaveQuizModal: React.FC<Props> = ({
  questions,
  categories,
  isOpen,
  onClose,
  translation,
  updateQuizName,
}) => {
  const { mutate, isPending } = useSaveQuiz();
  const [newCategory, setNewCategory] = useState<
    Omit<Category, "id"> | undefined
  >(undefined);

  const form = useForm<z.infer<typeof saveQuizSchema>>({
    resolver: zodResolver(saveQuizSchema),
    defaultValues: {
      name: "",
      questions,
      categoryId: categories[0]?.id || undefined,
      newCategory: undefined,
    },
  });

  useEffect(() => {
    form.setValue("newCategory", newCategory);
  }, [newCategory, form]);

  const handleSave = form.handleSubmit(
    (data) => {
      const payload = {
        ...data,
        categoryId: newCategory ? undefined : data.categoryId,
        newCategory: newCategory || undefined,
      };

      mutate(payload, { onSuccess: onClose });
      updateQuizName(data.name);
    },
    (errors) => {
      console.log("Errors:", errors);
    }
  );

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

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{translation.home.quiz.modal.category}</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={(value) => {
                      if (value === "new") {
                        setNewCategory({ name: "", color: "#000000" });
                        form.setValue("categoryId", null, {
                          shouldValidate: true,
                        });
                      } else {
                        setNewCategory(undefined);
                        form.setValue("categoryId", value, {
                          shouldValidate: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={translation.home.quiz.modal.selectCategory}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                      <SelectItem value="new">
                        {translation.home.quiz.modal.newCategory}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {newCategory && (
            <div className="space-y-4">
              <FormItem>
                <FormLabel>
                  {translation.home.quiz.modal.newCategoryName}
                </FormLabel>
                <FormControl>
                  <Input
                    value={newCategory?.name || ""}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...(prev || { color: "#000000" }),
                        name: e.target.value,
                      }))
                    }
                    placeholder={
                      translation.home.quiz.modal.newCategoryNamePlaceholder
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
              <FormItem>
                <FormLabel>
                  {translation.home.quiz.modal.newCategoryColor}
                </FormLabel>
                <FormControl>
                  <Input
                    type="color"
                    value={newCategory?.color || "#000000"}
                    onChange={(e) =>
                      setNewCategory((prev) => ({
                        ...(prev || { name: "" }),
                        color: e.target.value,
                      }))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}

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
