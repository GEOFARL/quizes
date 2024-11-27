"use client";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { ButtonProps, buttonVariants } from "@/components/ui/button";
import usePathWithLocale from "@/hooks/use-path-with-locale";
import { cn } from "@/lib/utils";
import Link from "next/link";

const Register: React.FC<ButtonProps> = ({ className }) => {
  const translation = useTranslation();
  const constructPath = usePathWithLocale();
  return (
    <Link
      href={constructPath("/register")}
      className={cn(buttonVariants(), className)}
    >
      {translation?.global.auth.signUp}
    </Link>
  );
};

export default Register;
