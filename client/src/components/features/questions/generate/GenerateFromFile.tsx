"use client";

import { questionsApi } from "@/api/questions-api";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import FileDropzone from "../../../common/FileDropzone";
import { GenerateQuestionsResponse } from "@/types/questions/response";

type Props = {
  translation: Dictionary;
  onSuccess?: (data: GenerateQuestionsResponse) => void;
};

const GenerateFromFile: React.FC<Props> = ({ translation, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: questionsApi.generateQuestions,
    onSuccess: (data) => {
      console.log("Generated questions:", data);
      onSuccess?.(data);
    },
    onError: (error) => {
      console.error("Error generating questions:", error);
    },
  });

  const handleSubmit = () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    mutation.mutate(formData);
  };

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
          setSelectedFile(files[0]);
        }}
        dropzoneText={{
          active: translation.home["generate-question-form"].dnd.active,
          default: translation.home["generate-question-form"].dnd.default,
          disabled: translation.home["generate-question-form"].dnd.disabled,
        }}
        translation={translation}
      />
      <div className="flex justify-end">
        <Button
          type="button"
          onClick={handleSubmit}
          className="px-8"
          disabled={mutation.isPending || !selectedFile}
        >
          {mutation.isPending
            ? translation.home["generate-question-form"]["button-loading"]
            : translation.home["generate-question-form"].button}
        </Button>
      </div>
    </div>
  );
};

export default GenerateFromFile;
