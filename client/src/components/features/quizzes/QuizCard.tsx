import DeleteButton from "@/components/common/button/Delete";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { pluralizationRules, pluralize } from "@/lib/pluralize";
import { Dictionary } from "@/types/dictionary";
import { Quiz } from "@/types/quiz/quiz";
import Dialog from "../auth/Dialog";
import Questions from "../questions/Questions";

type Props = {
  quiz: Quiz;
  translation: Dictionary;
  openQuizId: string | null;
  setOpenQuizId: (id: string | null) => void;
  onDelete: () => void;
};

const QuizCard: React.FC<Props> = ({
  quiz,
  translation,
  openQuizId,
  setOpenQuizId,
  onDelete,
}) => {
  const handleDialogClose = () => setOpenQuizId(null);
  const categoryColor = quiz.category?.color || "#f0f0f0";

  return (
    <Card
      key={quiz.id}
      className="w-full shadow-md border rounded-lg relative"
      style={{
        backgroundColor: `${categoryColor}50`,
      }}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-xl font-semibold">{quiz.name}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            {pluralize(
              quiz.questions?.length,
              "quizzes.card.questionsForms",
              translation,
              pluralizationRules
            )}
          </p>

          <Button
            onClick={() => {
              setOpenQuizId(quiz.id);
            }}
          >
            {translation.quizzes.card.viewQuestions}
          </Button>
        </div>

        <div className="absolute top-[6px] right-[6px]">
          <DeleteButton onClick={onDelete} />
        </div>
      </CardContent>

      {openQuizId === quiz.id && (
        <Dialog
          open={openQuizId === quiz.id}
          onOpenChange={handleDialogClose}
          className="w-[90vw] md:max-w-[1200px] max-h-[85vh] overflow-auto"
        >
          <Questions
            questions={quiz.questions}
            quizName={quiz.name}
            translation={translation}
          />
        </Dialog>
      )}
    </Card>
  );
};

export default QuizCard;
