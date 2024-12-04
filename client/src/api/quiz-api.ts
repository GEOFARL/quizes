import { SaveQuizPayload } from "@/types/quiz/payload";
import { BaseApi } from "./base-api";
import { autobind } from "@/lib/autobind";
import { Quiz } from "@/types/quiz/quiz";

class QuizApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}/quiz`);
    autobind(this);
  }

  async saveQuiz(payload: SaveQuizPayload, token?: string): Promise<void> {
    return this.fetch<void>("/save", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async getQuizzes(token?: string): Promise<Quiz[]> {
    return this.fetch<Quiz[]>("/", {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

export const quizApi = new QuizApi();
