"use client";

import LoginForm from "@/components/auth/LoginForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useLogin from "@/hooks/auth/use-login";

const LoginScreen = () => {
  const login = useLogin();
  return (
    <div className="mt-[125px]">
      <Card className="max-w-[500px] mx-auto w-full">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <LoginForm onSubmit={login} />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;
