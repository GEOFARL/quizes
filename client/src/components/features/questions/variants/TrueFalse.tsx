import HighlightText from "@/components/utils/TextHighlight";
import capitalize from "@/lib/capitalize";
import { cn } from "@/lib/utils";
import { GenerateQuestionsResponse } from "@/types/questions/response";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  highlight: string;
};

const TrueFalse: React.FC<Props> = ({ question, highlight }) => {
  return (
    <div>
      <p className="font-semibold text-lg text-gray-800 dark:text-gray-100">
        <HighlightText text={question.question} highlight={highlight} />
      </p>
      <div className="space-y-1 mt-2">
        {question.options?.map((option) => (
          <div
            className={cn(
              "w-full px-4 py-2 rounded-md cursor-pointer",
              "bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-800",
              {
                "bg-gray-400 dark:bg-green-600 hover:bg-gray-500 dark:hover:bg-green-700":
                  question.correctAnswers[0] === option,
              }
            )}
            key={option}
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">
              <HighlightText text={capitalize(option)} highlight={highlight} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrueFalse;
