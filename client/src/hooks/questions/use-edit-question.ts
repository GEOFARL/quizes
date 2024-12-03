import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useState } from "react";

const useEditQuestion = ({
  question,
  onUpdateTitle = () => {},
  onUpdateOptions = () => {},
  onUpdateCorrectAnswers = () => {},
  onUpdateExplanation = () => {},
}: {
  question: GenerateQuestionsResponse["questions"][number];
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateOptions?: (newOptions: string[]) => void;
  onUpdateCorrectAnswers?: (newCorrectAnswers: string[]) => void;
  onUpdateExplanation?: (newExplanation: string) => void;
}) => {
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(
    null
  );
  const [isEditingExplanation, setIsEditingExplanation] = useState(false);
  const [tempQuestion, setTempQuestion] = useState(question.question);
  const [tempOptions, setTempOptions] = useState(question.options || []);
  const [tempExplanation, setTempExplanation] = useState(
    question.explanation || ""
  );

  const handleSaveQuestion = () => {
    if (onUpdateTitle) {
      onUpdateTitle(tempQuestion);
    }
    setIsEditingQuestion(false);
  };

  const handleSaveOption = (index: number) => {
    if (index === null) return;

    const updatedOptions = [...tempOptions];
    const oldOption = question.options?.[index];
    const newOption = tempOptions[index];

    updatedOptions[index] = newOption;

    if (onUpdateOptions) {
      onUpdateOptions(updatedOptions);
    }

    if (
      onUpdateCorrectAnswers &&
      oldOption &&
      question.correctAnswers.includes(oldOption)
    ) {
      const updatedCorrectAnswers = question.correctAnswers.map((answer) =>
        answer === oldOption ? newOption : answer
      );
      onUpdateCorrectAnswers(updatedCorrectAnswers);
    }

    setEditingOptionIndex(null);
  };

  const handleSaveExplanation = () => {
    if (onUpdateExplanation) {
      onUpdateExplanation(tempExplanation);
    }
    setIsEditingExplanation(false);
  };

  return {
    isEditingQuestion,
    setIsEditingQuestion,
    editingOptionIndex,
    setEditingOptionIndex,
    isEditingExplanation,
    setIsEditingExplanation,
    tempQuestion,
    setTempQuestion,
    tempOptions,
    setTempOptions,
    tempExplanation,
    setTempExplanation,
    handleSaveQuestion,
    handleSaveOption,
    handleSaveExplanation,
  };
};

export default useEditQuestion;
