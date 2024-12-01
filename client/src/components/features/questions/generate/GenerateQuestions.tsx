"use client";

import { questionsApi } from "@/api/questions-api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import getToken from "@/lib/getToken";
import { User } from "@/lib/user/user";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useMutation } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import GenerateFromFile from "./GenerateFromFile";
import GenerateFromText from "./GenerateFromText";
import UnauthorizedOverlay from "./UnauthorizedOverlay";
import { pluralize } from "@/lib/pluralize";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

type Props = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  translation: Dictionary;
  user: string;
  questions: GenerateQuestionsResponse["questions"] | null;
  resetQuestions: () => void;
  openQuestions: () => void;
};

const pluralizationRules: Record<string, (count: number) => number> = {
  en: (count: number) => (count === 1 ? 0 : 1),
  uk: (count: number) => {
    const mod10 = count % 10;
    const mod100 = count % 100;
    if (mod10 === 1 && mod100 !== 11) return 0;
    if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return 1;
    return 2;
  },
};

const GenerateQuestionsForm: React.FC<Props> = ({
  onSuccess,
  translation,
  user,
  questions,
  resetQuestions,
  openQuestions,
}) => {
  const [isText, setIsText] = useState(false);
  const [numQuestions, setNumQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState<string>("1");
  const [questionTypes, setQuestionTypes] = useState<string[]>([
    "single-choice",
    "multiple-choice",
    "true-false",
  ]);
  const [includeExplanations, setIncludeExplanations] = useState(false);

  const pathname = usePathname();
  const locale = pathname.split("/")[1];

  const deserializedUser = User.fromString(user);

  const toggleQuestionType = (type: string) => {
    setQuestionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return questionsApi.generateQuestions(formData, await getToken());
    },
    onSuccess: (data) => {
      console.log("Questions generated:", data);
      onSuccess?.(data);
    },
  });

  const handleSubmit = useCallback(
    (formData: FormData) => {
      formData.append("numQuestions", numQuestions.toString());
      formData.append(
        "difficulty",
        translation.home["generate-question-form"].options.difficultyLevels[
          parseInt(difficulty) - 1
        ]
      );
      questionTypes.forEach((type) => formData.append("questionTypes[]", type));
      formData.append("includeExplanations", includeExplanations.toString());
      formData.append("locale", locale);
      mutation.mutate(formData);
    },
    [
      numQuestions,
      difficulty,
      questionTypes,
      includeExplanations,
      locale,
      mutation,
      translation,
    ]
  );

  return (
    <div>
      <div className="absolute w-[160px] top-[4px] right-[4px] p-2 bg-gray-100 dark:bg-gray-800 flex items-center justify-center gap-2 rounded-md shadow border-2 border-gray-300 dark:border-gray-600 z-10">
        <Label htmlFor="file-text" className="text-gray-700 dark:text-gray-300">
          {translation.home["generate-question-form"].switch}
        </Label>
        <Switch id="file-text" onCheckedChange={setIsText} />
      </div>

      <div className="absolute top-[4px] right-[168px] flex items-center gap-2 rounded-md shadow border-2 border-gray-300 dark:border-gray-600 z-10">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="py-2 bg-gray-100 dark:bg-gray-800"
            >
              {translation.home["generate-question-form"].options.menu}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="num-questions" className="w-full max-w-[95px]">
                  {
                    translation.home["generate-question-form"].options
                      .numQuestions
                  }
                </Label>
                <div className="w-full space-y-1">
                  <Slider
                    value={[numQuestions]}
                    onValueChange={(value) => setNumQuestions(value[0])}
                    min={1}
                    max={30}
                    step={1}
                  />
                  <p className="text-sm text-gray-500">
                    {pluralize(
                      numQuestions,
                      "home.generate-question-form.options.questionsForms",
                      translation,
                      pluralizationRules
                    )}
                  </p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Label htmlFor="difficulty" className="w-full max-w-[95px]">
                  {
                    translation.home["generate-question-form"].options
                      .difficulty
                  }
                </Label>
                <Select value={difficulty} onValueChange={setDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {translation.home[
                      "generate-question-form"
                    ].options.difficultyLevels.map(
                      (level: string, index: number) => (
                        <SelectItem key={index} value={(index + 1).toString()}>
                          {level}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>
                  {
                    translation.home["generate-question-form"].options
                      .questionTypes.title
                  }
                </Label>
                {["single-choice", "multiple-choice", "true-false"].map(
                  (type) => (
                    <div key={type} className="flex items-center gap-2">
                      <Checkbox
                        checked={questionTypes.includes(type)}
                        onCheckedChange={() => toggleQuestionType(type)}
                      />
                      <Label>
                        {
                          translation.home["generate-question-form"].options
                            .questionTypes.types[type as "single-choice"]
                        }
                      </Label>
                    </div>
                  )
                )}
              </div>

              <Separator />

              <div className="flex items-center gap-2">
                <Checkbox
                  checked={includeExplanations}
                  onCheckedChange={(checked) =>
                    setIncludeExplanations(
                      checked === "indeterminate" ? false : checked
                    )
                  }
                />
                <Label>
                  {
                    translation.home["generate-question-form"].options
                      .includeExplanations
                  }
                </Label>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {isText ? (
        <GenerateFromText
          translation={translation}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          questions={questions}
          resetQuestions={resetQuestions}
          openQuestions={openQuestions}
        />
      ) : (
        <GenerateFromFile
          translation={translation}
          onSubmit={handleSubmit}
          isLoading={mutation.isPending}
          questions={questions}
          resetQuestions={resetQuestions}
          openQuestions={openQuestions}
        />
      )}
      {!deserializedUser && <UnauthorizedOverlay translation={translation} />}
    </div>
  );
};

export default GenerateQuestionsForm;
