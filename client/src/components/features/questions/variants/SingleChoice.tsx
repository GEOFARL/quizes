import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import toKebabCase from "@/lib/to-kebab-case";
import { GenerateQuestionsResponse } from "@/types/questions/response";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
};

const SingleChoice: React.FC<Props> = ({ question }) => {
  return (
    <div>
      <p className="font-semibold text-lg">{question.question}</p>
      <RadioGroup
        defaultValue={toKebabCase(question.correctAnswers[0])}
        className="mt-2"
      >
        {question.options?.map((option) => (
          <div className="flex items-center space-x-2" key={option}>
            <RadioGroupItem
              value={toKebabCase(option)}
              id={toKebabCase(option)}
            />
            <Label htmlFor={toKebabCase(option)}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SingleChoice;
