"use client";

import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useCallback, useState } from "react";
import FileDropzone from "../../../common/FileDropzone";
import ManageQuestions from "./ManageQuestions";

type Props = {
  translation: Dictionary;
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
  questions: GenerateQuestionsResponse["questions"] | null;
  resetQuestions: () => void;
  openQuestions: () => void;
};

const GenerateFromFile: React.FC<Props> = ({
  translation,
  onSubmit,
  isLoading,
  questions,
  resetQuestions,
  openQuestions,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [areFilesRemoved, setAreFilesRemoved] = useState(false);
  const { user } = useUserContext();

  const handleSubmit = useCallback(() => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    onSubmit(formData);
  }, [onSubmit, selectedFile]);

  return (
    <div className="space-y-2">
      <FileDropzone
        className="min-h-[325.25px]"
        accept={{
          "application/pdf": [".pdf"],
          "text/plain": [".txt"],
        }}
        multiple={false}
        onFilesChange={(files) => {
          setAreFilesRemoved(false);
          setSelectedFile(files[0]);
        }}
        dropzoneText={{
          active: translation.home["generate-question-form"].dnd.active,
          default: translation.home["generate-question-form"].dnd.default,
          disabled: translation.home["generate-question-form"].dnd.disabled,
        }}
        translation={translation}
        removeAllFiles={areFilesRemoved}
      />
      <div className="flex justify-end">
        {!questions ? (
          <Button
            type="button"
            onClick={handleSubmit}
            className="px-8"
            disabled={!user || isLoading || !selectedFile}
          >
            {isLoading
              ? translation.home["generate-question-form"]["button-loading"]
              : translation.home["generate-question-form"].button}
          </Button>
        ) : (
          <ManageQuestions
            resetQuestions={resetQuestions}
            openQuestions={openQuestions}
            translation={translation}
          />
        )}
      </div>
    </div>
  );
};

export default GenerateFromFile;
