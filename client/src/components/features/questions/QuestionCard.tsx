import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HighlightText from "@/components/utils/TextHighlight";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { PropsWithChildren } from "react";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  translation: Dictionary;
  highlight: string;
} & PropsWithChildren;

const QuestionCard: React.FC<Props> = ({
  question,
  translation,
  highlight,
  children,
}) => {
  return (
    <Card className="border border-gray-200 dark:border-gray-700 shadow-md">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground">
          {translation.home.questions.question} {question.id}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {children}
        {question.explanation && (
          <Card className="mt-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
            <CardHeader className="pt-3 pb-2 px-4">
              <CardTitle className="text-sm font-medium">
                {translation.home.questions.explanation}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 px-4 pb-3">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <HighlightText
                  text={question.explanation}
                  highlight={highlight}
                />
              </p>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
