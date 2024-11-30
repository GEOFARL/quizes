import { BaseApi } from "./base-api";
import { autobind } from "@/lib/autobind";
import { GenerateQuestionsPayload } from "@/types/questions/payload";
import { GenerateQuestionsResponse } from "@/types/questions/response";

class QuestionsApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}`);
    autobind(this);
  }

  /**
   * Generate questions based on the provided text
   * @param payload The payload containing the text for generating questions
   * @returns A response containing the generated questions
   */
  async generateQuestions(
    payload: GenerateQuestionsPayload
  ): Promise<GenerateQuestionsResponse> {
    return this.fetch<GenerateQuestionsResponse>("questions", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const questionsApi = new QuestionsApi();
