import { SaveQuizPayload } from "@/types/quiz/payload";
import { BaseApi } from "./base-api";
import { autobind } from "@/lib/autobind";
import { Quiz } from "@/types/quiz/quiz";
import { GetQuizzesResponse } from "@/types/quiz/response";

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

  async getQuizzes(
    page: number = 1,
    limit: number = 10,
    token?: string
  ): Promise<GetQuizzesResponse> {
    return this.fetch<GetQuizzesResponse>("/", {
      method: "GET",
      queryParams: {
        page,
        limit,
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

export const quizApi = new QuizApi();
