"use client";
import { Button, ButtonProps } from "@/components/ui/button";
import usePathWithLocale from "@/hooks/use-path-with-locale";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { ClientCookieStorageStrategy } from "@/lib/storage/cookies/client";
import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { Dictionary } from "@/types/dictionary";
import { useRouter } from "next/navigation";
import { forwardRef, ForwardRefRenderFunction, Ref, useCallback } from "react";

type Props = {
  translation: Dictionary;
} & ButtonProps;

const SignOut: ForwardRefRenderFunction<HTMLButtonElement, Props> = (
  { variant, translation, ...props },
  ref: Ref<HTMLButtonElement>
) => {
  const router = useRouter();
  const constructPath = usePathWithLocale();
  const signOut = useCallback(() => {
    new TokenStorage(new LocalStorageStrategy()).clear();
    new TokenStorage(new ClientCookieStorageStrategy()).clear();
    router.push(constructPath("/"));
    router.refresh();
  }, [router, constructPath]);
  return (
    <Button
      {...props}
      className="w-full focus-visible:ring-transparent focus-visible:ring-offset-0"
      variant={variant ? variant : "default"}
      ref={ref}
      onClick={signOut}
    >
      {translation.global.auth.signOut}
    </Button>
  );
};

export default forwardRef(SignOut);
