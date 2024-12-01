import { GenerateQuestionsResponse } from "@/types/questions/response";
import SingleChoice from "./variants/SingleChoice";
import MultipleChoice from "./variants/MultipleChoice";
import TrueFalse from "./variants/TrueFalse";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dictionary } from "@/types/dictionary";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
  translation: Dictionary;
};

const componentByType: Record<
  string,
  React.FC<{ question: GenerateQuestionsResponse["questions"][number] }>
> = {
  "single-choice": SingleChoice,
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
};

const Questions: React.FC<Props> = ({ questions, translation }) => {
  return (
    <div className="flex flex-col space-y-6">
      {questions.map((question) => {
        const Component = componentByType[question.type];
        return (
          <Card
            key={question.id}
            className="border border-gray-200 dark:border-gray-700 shadow-md"
          >
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {translation.home.questions.question} {question.id}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <Component question={question} />
              {question.explanation && (
                <Card className="mt-4 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                  <CardHeader className="pt-3 pb-2 px-4">
                    <CardTitle className="text-sm font-medium">
                      {translation.home.questions.explanation}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-4 pb-3">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {question.explanation}
                    </p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default Questions;
