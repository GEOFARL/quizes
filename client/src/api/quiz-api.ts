import { autobind } from "@/lib/autobind";
import { SaveQuizPayload } from "@/types/quiz/payload";
import { GetQuizzesResponse } from "@/types/quiz/response";
import { BaseApi } from "./base-api";

class QuizApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}/quiz`);
    autobind(this);
  }

  async saveQuiz(payload: SaveQuizPayload, token?: string): Promise<void> {
    return this.fetch<void>("/save", {
      method: "POST",
      body: JSON.stringify({
        categoryId: payload.categoryId,
        newCategory: payload.newCategory,
        quiz: {
          name: payload.name,
          questions: payload.questions,
        },
      }),
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async getQuizzes(
    page: number = 1,
    limit: number = 10,
    token?: string,
    categoryIDs?: string[]
  ): Promise<GetQuizzesResponse> {
    return this.fetch<GetQuizzesResponse>("/", {
      method: "GET",
      queryParams: {
        page,
        limit,
        categories: categoryIDs?.join(","),
      },
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }

  async deleteQuiz(quizId: string, token?: string) {
    return this.fetch<void>(`/${quizId}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

export const quizApi = new QuizApi();
