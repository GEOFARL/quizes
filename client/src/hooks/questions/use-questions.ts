import { useState, useCallback } from "react";
import { GenerateQuestionsResponse } from "@/types/questions/response";

export const useQuestions = (
  initialQuestions: GenerateQuestionsResponse["questions"] | null
) => {
  const [questions, setQuestions] = useState(initialQuestions);

  const deleteQuestion = useCallback((id: string) => {
    setQuestions(
      (prevQuestions) => prevQuestions?.filter((q) => q.id !== id) ?? []
    );
  }, []);

  const updateCorrectAnswers = useCallback(
    (id: string, correctAnswers: string[]) => {
      setQuestions(
        (prevQuestions) =>
          prevQuestions?.map((q) =>
            q.id === id ? { ...q, correctAnswers } : q
          ) ?? []
      );
    },
    []
  );

  const handleUpdateTitle = useCallback((id: string, newTitle: string) => {
    setQuestions(
      (prev) =>
        prev?.map((q) => (q.id === id ? { ...q, question: newTitle } : q)) ?? []
    );
  }, []);

  const handleUpdateOptions = useCallback(
    (id: string, newOptions: string[]) => {
      setQuestions(
        (prev) =>
          prev?.map((q) => (q.id === id ? { ...q, options: newOptions } : q)) ??
          []
      );
    },
    []
  );

  const handleUpdateExplanation = useCallback(
    (id: string, newExplanation: string) => {
      setQuestions(
        (prev) =>
          prev?.map((q) =>
            q.id === id ? { ...q, explanation: newExplanation } : q
          ) ?? []
      );
    },
    []
  );

  return {
    questions,
    setQuestions,
    deleteQuestion,
    updateCorrectAnswers,
    handleUpdateOptions,
    handleUpdateTitle,
    handleUpdateExplanation,
  };
};
