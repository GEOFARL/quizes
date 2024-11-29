"use client";

import useLogin from "@/hooks/auth/use-login";
import Dialog from "./Dialog";
import LoginForm from "./LoginForm";
import { Dictionary } from "@/types/dictionary";

type Props = {
  translation: Dictionary;
};

const LoginDialog: React.FC<Props> = ({ translation }) => {
  const login = useLogin();
  return (
    <Dialog
      title={translation?.auth.login.title}
      description={translation?.auth.login.description}
    >
      <LoginForm onSubmit={login} translation={translation} />
    </Dialog>
  );
};

export default LoginDialog;
