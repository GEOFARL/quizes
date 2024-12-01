export interface GenerateQuestionsResponse {
  questions: Array<{
    id: string;
    question: string;
    type: "single-choice" | "multiple-choice" | "true-false";
    options?: string[];
    correctAnswers: string[];
    explanation?: string;
  }>;
}
