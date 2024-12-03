import { useState, useCallback } from "react";
import { GenerateQuestionsResponse } from "@/types/questions/response";

export const useQuestions = (
  initialQuestions: GenerateQuestionsResponse["questions"]
) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions((prevQuestions) => prevQuestions.filter((q) => q.id !== id));
  }, []);

  const updateCorrectAnswers = useCallback(
    (id: string, correctAnswers: string[]) => {
      setQuestions((prevQuestions) =>
        prevQuestions.map((q) => (q.id === id ? { ...q, correctAnswers } : q))
      );
    },
    []
  );

  return { questions, deleteQuestion, updateCorrectAnswers };
};
