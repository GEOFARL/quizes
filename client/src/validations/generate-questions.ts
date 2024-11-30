import { z } from "zod";

export const generateQuestionsSchema = z.object({
  text: z
    .string()
    .min(1, "The text field is required and cannot be empty")
    .max(5000, "The text field exceeds the maximum length of 5000 characters"),
});
