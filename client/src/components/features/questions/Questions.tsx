import { GenerateQuestionsResponse } from "@/types/questions/response";
import SingleChoice from "./variants/SingleChoice";
import MultipleChoice from "./variants/MultipleChoice";
import TrueFalse from "./variants/TrueFalse";

type Props = {
  questions: GenerateQuestionsResponse["questions"];
};

const componentByType: Record<
  string,
  React.FC<{ question: GenerateQuestionsResponse["questions"][number] }>
> = {
  "single-choice": SingleChoice,
  "multiple-choice": MultipleChoice,
  "true-false": TrueFalse,
};

const Questions: React.FC<Props> = ({ questions }) => {
  // return (
  //   <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-auto">
  //     {JSON.stringify(questions, null, 2)}
  //   </pre>
  // );
  return (
    <div className="flex flex-col space-y-4">
      {questions.map((question) => {
        const Component = componentByType[question.type];
        return <Component key={question.id} question={question} />;
      })}
    </div>
  );
};

export default Questions;
