import { Dictionary } from "@/types/dictionary";

type Props = {
  translation: Dictionary;
};

const QuizzesHeader: React.FC<Props> = ({ translation }) => {
  return (
    <div className="my-6">
      <h1 className="text-4xl font-bold text-center">
        {translation.quizzes.title}
      </h1>
    </div>
  );
};

export default QuizzesHeader;
