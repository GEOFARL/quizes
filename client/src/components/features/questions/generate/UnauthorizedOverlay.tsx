"use client";

import Register from "@/components/layout/header/actions/Register";
import SignIn from "@/components/layout/header/actions/SignIn";
import { Dictionary } from "@/types/dictionary";
import { Lock } from "lucide-react";

type Props = {
  translation: Dictionary;
};

const UnauthorizedOverlay: React.FC<Props> = ({ translation }) => {
  return (
    <div
      className="absolute inset-0 bg-white/60 dark:bg-black/60 z-[15] backdrop-blur-sm rounded-lg border-2
  border-gray-300 dark:border-gray-600 grid place-content-center text-gray-800 dark:text-white shadow-lg transition-all duration-300 ease-in-out"
    >
      <div className="w-[450px] flex flex-col space-y-2 items-center py-6 px-10 bg-white dark:bg-gray-900 shadow rounded-2xl border-2">
        <Lock className="w-[50px] h-[50px] text-gray-600 dark:text-gray-300" />
        <div className="flex flex-col">
          <h4 className="text-center text-lg lg:text-xl font-semibold">
            {translation.home["generate-question-form"].overlay.title}
          </h4>
          <p className="text-muted-foreground text-sm">
            {translation.home["generate-question-form"].overlay.subtitle}
          </p>
        </div>

        <div className="flex space-x-2 w-full">
          <SignIn translation={translation} className="w-[50%] px-6" />
          <Register translation={translation} className="w-[50%] px-6" />
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedOverlay;
