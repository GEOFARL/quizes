"use client";

import RegisterForm from "@/components/auth/RegisterForm";
import ScreenWrapper from "@/components/auth/ScreenWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useRegister from "@/hooks/auth/use-register";
import { Dictionary } from "@/types/dictionary";

type Props = {
  translation: Dictionary;
};

const RegisterScreen: React.FC<Props> = ({ translation }) => {
  const register = useRegister();
  return (
    <ScreenWrapper>
      <Card className="max-w-[500px] mx-auto w-full">
        <CardHeader>
          <CardTitle>{translation.auth.register.title}</CardTitle>
          <CardDescription>
            {translation.auth.register.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm translation={translation} onSubmit={register} />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
};

export default RegisterScreen;
