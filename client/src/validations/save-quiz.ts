import { z } from "zod";

export const saveQuizSchema = z.object({
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
});
