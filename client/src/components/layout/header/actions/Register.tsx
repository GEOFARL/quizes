"use client";
import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import usePathWithLocale from "@/hooks/use-path-with-locale";
import { cn } from "@/lib/utils";
import { Dictionary } from "@/types/dictionary";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  translation: Dictionary;
} & ButtonProps;

const Register: React.FC<Props> = ({ className, translation }) => {
  const pathname = usePathname();
  const constructPath = usePathWithLocale();
  const registerPath = constructPath("/register");
  return pathname === registerPath ? (
    <Button className={cn(buttonVariants(), className)}>
      {translation.global.auth.signUp}
    </Button>
  ) : (
    <Link href={registerPath} className={cn(buttonVariants(), className)}>
      {translation.global.auth.signUp}
    </Link>
  );
};

export default Register;
