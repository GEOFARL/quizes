"use client";

import LoginForm from "@/components/features/auth/LoginForm";
import ScreenWrapper from "@/components/features/auth/ScreenWrapper";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLogin from "@/hooks/auth/use-login";
import { Dictionary } from "@/types/dictionary";

type Props = {
  translation: Dictionary;
};

const LoginScreen: React.FC<Props> = ({ translation }) => {
  const login = useLogin();
  return (
    <ScreenWrapper>
      <Card className="max-w-[500px] mx-auto w-full">
        <CardHeader>
          <CardTitle>{translation.auth.login.title}</CardTitle>
          <CardDescription>
            {translation.auth.login.description}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm translation={translation} onSubmit={login} />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
};

export default LoginScreen;
