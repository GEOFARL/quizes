import { useState, useCallback } from "react";
import { GenerateQuestionsResponse } from "@/types/questions/response";

export const useQuestions = (
  initialQuestions: GenerateQuestionsResponse["questions"]
) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  }, []);

  return { questions, deleteQuestion };
};
