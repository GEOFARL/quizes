"use client";

import { questionsApi } from "@/api/questions-api";
import { useUserContext } from "@/components/providers/UserProvider";
import { Button } from "@/components/ui/button";
import getToken from "@/lib/getToken";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import FileDropzone from "../../../common/FileDropzone";
import ManageQuestions from "./ManageQuestions";

type Props = {
  translation: Dictionary;
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  questions: GenerateQuestionsResponse["questions"] | null;
  resetQuestions: () => void;
  openQuestions: () => void;
};

const GenerateFromFile: React.FC<Props> = ({
  translation,
  onSuccess,
  questions,
  resetQuestions,
  openQuestions,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [areFilesRemoved, setAreFilesRemoved] = useState(false);
  const { user } = useUserContext();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      return questionsApi.generateQuestions(data, await getToken());
    },
    onSuccess: (data) => {
      console.log("Generated questions:", data);
      setSelectedFile(null);
      setAreFilesRemoved(true);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Error generating questions:", error);
    },
  });

  const handleSubmit = useCallback(() => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    mutation.mutate(formData);
  }, [mutation, selectedFile]);

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
            disabled={!user || mutation.isPending || !selectedFile}
          >
            {mutation.isPending
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
