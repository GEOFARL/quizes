"use client";

import useRegister from "@/hooks/auth/use-register";
import { Dictionary } from "@/types/dictionary";
import Dialog from "./Dialog";
import RegisterForm from "./RegisterForm";

type Props = {
  translation: Dictionary;
};

const RegisterDialog: React.FC<Props> = ({ translation }) => {
  const register = useRegister();
  return (
    <Dialog
      title={translation?.auth.register.title}
      description={translation?.auth.register.description}
    >
      <RegisterForm translation={translation} onSubmit={register} />
    </Dialog>
  );
};

export default RegisterDialog;
