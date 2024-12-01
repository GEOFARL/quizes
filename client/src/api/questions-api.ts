import { autobind } from "@/lib/autobind";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { BaseApi } from "./base-api";

class QuestionsApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}`);
    autobind(this);
  }

  async generateQuestions(
    formData: FormData,
    token?: string
  ): Promise<GenerateQuestionsResponse> {
    return this.fetch<GenerateQuestionsResponse>("questions", {
      method: "POST",
      body: formData,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
  }
}

export const questionsApi = new QuestionsApi();
