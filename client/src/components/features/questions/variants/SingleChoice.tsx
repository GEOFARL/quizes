import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import HighlightText from "@/components/utils/TextHighlight";
import toKebabCase from "@/lib/to-kebab-case";
import { GenerateQuestionsResponse } from "@/types/questions/response";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  highlight: string;
  onUpdateCorrectAnswers: (correctAnswers: string[]) => void;
};

const SingleChoice: React.FC<Props> = ({
  question,
  highlight,
  onUpdateCorrectAnswers,
}) => {
  return (
    <div>
      <p className="font-semibold text-lg">
        <HighlightText text={question.question} highlight={highlight} />
      </p>
      <RadioGroup
        defaultValue={toKebabCase(question.correctAnswers[0])}
        className="mt-2"
        onValueChange={(value) => onUpdateCorrectAnswers([value])}
      >
        {question.options?.map((option) => (
          <div className="flex items-center space-x-2" key={option}>
            <RadioGroupItem
              value={toKebabCase(option)}
              id={toKebabCase(option)}
            />
            <Label htmlFor={toKebabCase(option)}>
              <HighlightText text={option} highlight={highlight} />
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default SingleChoice;
