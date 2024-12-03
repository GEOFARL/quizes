import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HighlightText from "@/components/utils/TextHighlight";
import toKebabCase from "@/lib/to-kebab-case";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import EditTitle from "../edit/EditTitle";
import useEditQuestion from "@/hooks/questions/use-edit-question";
import EditText from "../edit/EditText";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  highlight: string;
  onUpdateCorrectAnswers: (correctAnswers: string[]) => void;
  onUpdateOptions: (options: string[]) => void;
  onUpdateTitle: (newTitle: string) => void;
};

const SingleChoice: React.FC<Props> = ({
  question,
  highlight,
  onUpdateCorrectAnswers,
  onUpdateOptions,
  onUpdateTitle,
}) => {
  const {
    editingOptionIndex,
    handleSaveOption,
    setEditingOptionIndex,
    setTempOptions,
    tempOptions,
  } = useEditQuestion({
    question,
    onUpdateTitle,
    onUpdateOptions,
    onUpdateCorrectAnswers,
  });

  if (question.id === "1") {
    console.log("Question", question);
  }

  const kebabToOriginalMap: Record<string, string> =
    question.options?.reduce(
      (map, option) => ({ ...map, [toKebabCase(option)]: option }),
      {}
    ) ?? {};

  return (
    <div>
      <EditTitle
        onUpdateOptions={onUpdateOptions}
        onUpdateTitle={onUpdateTitle}
        onUpdateCorrectAnswers={onUpdateCorrectAnswers}
        question={question}
      >
        <p className="font-semibold text-lg">
          <HighlightText text={question.question} highlight={highlight} />
        </p>
      </EditTitle>

      <RadioGroup
        value={toKebabCase(question.correctAnswers[0])}
        className="mt-2"
        onValueChange={(kebabValue) => {
          const originalValue = kebabToOriginalMap[kebabValue];
          if (originalValue) {
            onUpdateCorrectAnswers([originalValue]);
          }
        }}
      >
        {tempOptions?.map((option, index) => {
          console.log("Option", option);
          console.log(
            toKebabCase(question.correctAnswers[0]),
            toKebabCase(question.options?.[index] ?? "")
          );

          return (
            <div
              className="flex items-center space-x-2"
              key={`${option}-${index}`}
            >
              <RadioGroupItem
                value={toKebabCase(question.options?.[index] ?? "")}
                id={toKebabCase(option)}
              />
              <div className="flex items-center space-x-2 w-full group">
                {editingOptionIndex === index ? (
                  <EditText
                    value={tempOptions[index]}
                    cancelEditing={() => {
                      setEditingOptionIndex(null);
                      setTempOptions((prev) =>
                        prev.map((opt, i) =>
                          i === index ? question.options?.[i] ?? "" : opt
                        )
                      );
                    }}
                    save={() => handleSaveOption(index)}
                    updateValue={(newValue: string) => {
                      setTempOptions((prev) =>
                        prev.map((opt, i) => (i === index ? newValue : opt))
                      );
                    }}
                  />
                ) : (
                  <div className="flex items-center space-x-2 relative">
                    <Label htmlFor={toKebabCase(option)}>
                      <HighlightText text={option} highlight={highlight} />
                    </Label>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingOptionIndex(index)}
                      className="opacity-0 group-hover:opacity-100 absolute right-[-24px] top-[-8px] [&_svg]:size-3 p-1 h-[20px] w-[20px]"
                    >
                      <Edit />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default SingleChoice;
