import capitalize from "@/lib/capitalize";
import { cn } from "@/lib/utils";
import { GenerateQuestionsResponse } from "@/types/questions/response";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
};

const TrueFalse: React.FC<Props> = ({ question }) => {
  return (
    <div>
      <p className="font-semibold text-lg">{question.question}</p>
      <div className="space-y-1 mt-2">
        {question.options?.map((option) => (
          <div
            className={cn(
              "w-full px-4 py-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-200",
              {
                "bg-gray-400": question.correctAnswers[0] === option,
              }
            )}
            key={option}
          >
            <p className="text-sm font-medium">{capitalize(option)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrueFalse;
