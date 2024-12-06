import { GenerateQuestionsResponse } from "../questions/response";

export type SaveQuizPayload = {
  name: string;
  questions: GenerateQuestionsResponse["questions"];
  categoryId?: string | null;
  newCategory?: {
    name: string;
    color: string;
  };
};
