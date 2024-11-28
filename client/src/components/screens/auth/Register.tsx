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

const RegisterScreen = () => {
  const register = useRegister();
  return (
    <ScreenWrapper>
      <Card className="max-w-[500px] mx-auto w-full">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <RegisterForm onSubmit={register} />
        </CardContent>
      </Card>
    </ScreenWrapper>
  );
};

export default RegisterScreen;
