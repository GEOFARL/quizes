import { GenerateQuestionsResponse } from "../questions/response";

export type SaveQuizPayload = {
  name: string;
  questions: GenerateQuestionsResponse["questions"];
};
