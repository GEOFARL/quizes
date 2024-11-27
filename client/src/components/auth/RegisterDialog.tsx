"use client";

import useRegister from "@/hooks/auth/use-register";
import Dialog from "./Dialog";
import RegisterForm from "./RegisterForm";

const RegisterDialog: React.FC = () => {
  const register = useRegister();
  return (
    <Dialog
      title="Register"
      description="Enter your information to create an account"
    >
      <RegisterForm onSubmit={register} />
    </Dialog>
  );
};

export default RegisterDialog;
