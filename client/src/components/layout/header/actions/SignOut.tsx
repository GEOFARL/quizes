"use client";
import { useTranslation } from "@/components/providers/TranslationProvider";
import { Button, ButtonProps } from "@/components/ui/button";
import usePathWithLocale from "@/hooks/use-path-with-locale";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { ClientCookieStorageStrategy } from "@/lib/storage/cookies/client";
import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { useRouter } from "next/navigation";
import { forwardRef, ForwardRefRenderFunction, Ref, useCallback } from "react";

const SignOut: ForwardRefRenderFunction<HTMLButtonElement, ButtonProps> = (
  { variant, ...props },
  ref: Ref<HTMLButtonElement>
) => {
  const router = useRouter();
  const constructPath = usePathWithLocale();
  const translation = useTranslation();
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
      {translation?.global.auth.signOut}
    </Button>
  );
};

export default forwardRef(SignOut);
