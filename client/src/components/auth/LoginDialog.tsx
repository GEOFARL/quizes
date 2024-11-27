"use client";

import useLogin from "@/hooks/auth/use-login";
import Dialog from "./Dialog";
import LoginForm from "./LoginForm";

const LoginDialog: React.FC = () => {
  const login = useLogin();
  return (
    <Dialog
      title="Login"
      description="Enter your credentials to access your account"
    >
      <LoginForm onSubmit={login} />
    </Dialog>
  );
};

export default LoginDialog;
