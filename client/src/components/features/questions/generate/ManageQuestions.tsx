"use client";

import { Button } from "@/components/ui/button";
import { Dictionary } from "@/types/dictionary";

type Props = {
  resetQuestions: () => void;
  openQuestions: () => void;
  translation: Dictionary;
};

const ManageQuestions: React.FC<Props> = ({
  resetQuestions,
  openQuestions,
  translation,
}) => {
  return (
    <div className="space-x-2">
      <Button type="button" onClick={resetQuestions} className="px-8">
        {translation.home["generate-question-form"]["button-reset"]}
      </Button>
      <Button type="button" onClick={openQuestions} className="px-8">
        {translation.home["generate-question-form"]["button-open"]}
      </Button>
    </div>
  );
};

export default ManageQuestions;
