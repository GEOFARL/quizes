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

const SignIn: React.FC<Props> = ({
  className,
  translation,
  variant,
  ...props
}) => {
  const pathname = usePathname();
  const constructPath = usePathWithLocale();

  const loginPath = constructPath("/login");
  return pathname === loginPath ? (
    <Button
      className={cn(
        buttonVariants({ variant: variant ? variant : "secondary" }),
        className
      )}
      {...props}
    >
      {translation.global.auth.signIn}
    </Button>
  ) : (
    <Link
      href={constructPath("/login")}
      className={cn(
        buttonVariants({ variant: variant ? variant : "secondary" }),
        className
      )}
    >
      {translation.global.auth.signIn}
    </Link>
  );
};

export default SignIn;
