import { generateQuestionsSchema } from "@/validations/generate-questions";
import { z } from "zod";

export type GenerateQuestionsPayload = z.infer<typeof generateQuestionsSchema>;
