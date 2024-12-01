"use client";

import { useDropzone } from "react-dropzone";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";

type FileDropzoneProps = {
  translation?: Dictionary;
  accept?: Record<string, string[]>;
  multiple?: boolean;
  maxSize?: number;
  onFilesChange?: (files: File[]) => void;
  removeAllFiles?: boolean;
  className?: string;
  dropzoneText?: {
    default: string;
    active: string;
    disabled: string;
  };
};

const FileDropzone: React.FC<FileDropzoneProps> = ({
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    "application/pdf": [".pdf"],
  },
  multiple = true,
  maxSize = 10485760,
  onFilesChange,
  className,
  dropzoneText = {
    default: "Drag and drop your files here or click to browse",
    active: "Drop the files here...",
    disabled: "Only one file is allowed",
  },
  translation,
  removeAllFiles,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const updatedFiles = multiple
        ? [...files, ...acceptedFiles]
        : [acceptedFiles[0]];
      setFiles(updatedFiles);
      if (onFilesChange) {
        onFilesChange(updatedFiles);
      }
    },
    [files, onFilesChange, multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept,
    maxSize,
    disabled: !multiple && files.length > 0,
  });

  const removeFile = (fileToRemove: File) => {
    const updatedFiles = files.filter((file) => file !== fileToRemove);
    setFiles(updatedFiles);
    if (onFilesChange) {
      onFilesChange(updatedFiles);
    }
  };

  useEffect(() => {
    if (removeAllFiles) {
      setFiles([]);
    }
  }, [removeAllFiles]);

  const renderAcceptedFormats = () => {
    return Object.entries(accept).map(([mimeType, extensions], index) => (
      <div
        key={index}
        className="inline-block bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-full text-sm mr-2 mt-2"
      >
        {extensions.join(", ")} ({mimeType})
      </div>
    ));
  };

  return (
    <div className={cn("space-y-4 flex flex-col", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-md p-6 text-center transition cursor-pointer h-full grid content-center flex-1 min-h-[250px]",
          isDragActive
            ? "border-sky-400 bg-sky-50 dark:bg-sky-900"
            : "border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-800",
          files.length > 0 && !multiple ? "cursor-not-allowed opacity-50" : ""
        )}
      >
        <input {...getInputProps()} />
        <p className="text-gray-500 dark:text-gray-300">
          {files.length > 0 && !multiple
            ? dropzoneText.disabled
            : isDragActive
            ? dropzoneText.active
            : dropzoneText.default}
        </p>
      </div>

      <div className="flex flex-wrap">{renderAcceptedFormats()}</div>

      {files.length > 0 && (
        <ul className="space-y-2">
          {files.map((file, index) => (
            <li
              key={index}
              className="flex items-center justify-between p-2 border rounded-md"
            >
              <span className="text-gray-700">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-500"
                onClick={() => removeFile(file)}
              >
                {translation?.home["generate-question-form"].dnd.remove}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FileDropzone;
