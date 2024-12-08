import { GenerateQuestionsResponse } from "../questions/response";
import { Category } from "./category";

export interface Quiz {
  id: string;
  name: string;
  questions: GenerateQuestionsResponse["questions"];
  createdAt: string;
  categoryId: string;
  category: Category;
}
