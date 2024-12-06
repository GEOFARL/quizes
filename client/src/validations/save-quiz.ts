import { z } from "zod";

export const saveQuizSchema = z
  .object({
    name: z.string().min(1, "Quiz name is required"),
    questions: z
      .array(
        z.object({
          id: z.string(),
          question: z.string().min(1, "Question text is required"),
          type: z.enum(["single-choice", "multiple-choice", "true-false"]),
          options: z.array(z.string().min(1, "Option text is required")),
          correctAnswers: z.array(z.string().min(1)),
          explanation: z.string().optional(),
        })
      )
      .min(1, "At least one question is required"),
    categoryId: z.string().nullable(),
    newCategory: z
      .object({
        name: z.string().min(1, "Category name is required"),
        color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
      })
      .optional(),
  })
  .refine(
    (data) => {
      return data.categoryId || data.newCategory;
    },
    {
      message: "Either an existing category or a new category is required",
    }
  );
