"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { User } from "@/lib/user/user";
import { Dictionary } from "@/types/dictionary";
import { GenerateQuestionsResponse } from "@/types/questions/response";
import { useState } from "react";
import GenerateFromFile from "./GenerateFromFile";
import GenerateFromText from "./GenerateFromText";
import UnauthorizedOverlay from "./UnauthorizedOverlay";

type Props = {
  onSuccess?: (data: GenerateQuestionsResponse) => void;
  translation: Dictionary;
  user: string;
};

const GenerateQuestionsForm: React.FC<Props> = ({
  onSuccess,
  translation,
  user,
}) => {
  const [isText, setIsText] = useState(false);
  const deserializedUser = User.fromString(user);

  return (
    <div>
      <div className="absolute top-[4px] right-[4px] p-2 bg-gray-100 dark:bg-gray-800 flex items-center gap-2 rounded-md shadow border-2 border-gray-300 dark:border-gray-600 z-10">
        <Label htmlFor="file-text" className="text-gray-700 dark:text-gray-300">
          {translation.home["generate-question-form"].switch}
        </Label>
        <Switch id="file-text" onCheckedChange={setIsText} />
      </div>
      {isText ? (
        <GenerateFromText translation={translation} onSuccess={onSuccess} />
      ) : (
        <GenerateFromFile translation={translation} onSuccess={onSuccess} />
      )}
      {!deserializedUser && <UnauthorizedOverlay translation={translation} />}
    </div>
  );
};

export default GenerateQuestionsForm;
