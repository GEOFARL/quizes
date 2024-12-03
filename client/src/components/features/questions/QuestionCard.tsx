import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HighlightText from "@/components/utils/TextHighlight";
import useEditQuestion from "@/hooks/questions/use-edit-question";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { Edit } from "lucide-react";
import { PropsWithChildren } from "react";
import EditText from "./edit/EditText";

type Props = {
  question: GenerateQuestionsResponse["questions"][number];
  translation: Dictionary;
  highlight: string;
  onUpdateExplanation: (explanation: string) => void;
} & PropsWithChildren;

const QuestionCard: React.FC<Props> = ({
  question,
  translation,
  highlight,
  children,
  onUpdateExplanation,
}) => {
  const {
    handleSaveExplanation,
    isEditingExplanation,
    setIsEditingExplanation,
    setTempExplanation,
    tempExplanation,
  } = useEditQuestion({
    question,
    onUpdateExplanation,
  });

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
              <div className="flex items-center space-x-2 w-[95%]">
                {isEditingExplanation ? (
                  <EditText
                    value={tempExplanation}
                    cancelEditing={() => setIsEditingExplanation(false)}
                    save={handleSaveExplanation}
                    updateValue={setTempExplanation}
                  />
                ) : (
                  <div className="flex items-center space-x-2 relative">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <HighlightText
                        text={question.explanation}
                        highlight={highlight}
                      />
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingExplanation(true)}
                      className="absolute right-[-24px] top-[-8px] [&_svg]:size-3 p-1 h-[20px] w-[20px]"
                    >
                      <Edit />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
