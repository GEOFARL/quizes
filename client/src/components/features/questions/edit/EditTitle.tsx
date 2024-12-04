"use client";

import useEditQuestion from "@/hooks/questions/use-edit-question";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import EditText from "./EditText";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { PropsWithChildren } from "react";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  onUpdateOptions?: (options: string[]) => void;
  onUpdateTitle?: (newTitle: string) => void;
  onUpdateCorrectAnswers?: (newCorrectAnswers: string[]) => void;
} & PropsWithChildren;

const EditTitle: React.FC<Props> = ({
  question,
  onUpdateOptions,
  onUpdateTitle,
  onUpdateCorrectAnswers,
  children,
}) => {
  const {
    tempQuestion,
    isEditingQuestion,
    setTempQuestion,
    handleSaveQuestion,
    setIsEditingQuestion,
  } = useEditQuestion({
    question,
    onUpdateTitle,
    onUpdateOptions,
    onUpdateCorrectAnswers,
  });

  return (
    <div className="flex items-center space-x-2 w-[95%]">
      {onUpdateTitle && isEditingQuestion ? (
        <EditText
          value={tempQuestion}
          cancelEditing={() => setIsEditingQuestion(false)}
          save={handleSaveQuestion}
          updateValue={setTempQuestion}
        />
      ) : (
        <div className="flex items-center space-x-2 relative">
          {children}
          {onUpdateTitle && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsEditingQuestion(true)}
              className="absolute right-[-24px] top-[-8px] [&_svg]:size-3 p-1 h-[20px] w-[20px]"
            >
              <Edit />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default EditTitle;
