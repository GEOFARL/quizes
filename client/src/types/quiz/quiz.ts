import { GenerateQuestionsResponse } from "../questions/response";

export interface Quiz {
  id: string;
  name: string;
  questions: GenerateQuestionsResponse["questions"];
  createdAt: string;
}
