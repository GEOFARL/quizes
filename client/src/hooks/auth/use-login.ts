import { authApi } from "@/api/auth-api";
import { useUserContext } from "@/components/providers/UserProvider";
import { useToast } from "@/hooks/use-toast";
import { HttpError } from "@/lib/errors/http-error";
import { Token } from "@/lib/jwt/token";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { ClientCookieStorageStrategy } from "@/lib/storage/cookies/client";
import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { User } from "@/lib/user/user";
import { JwtPayload } from "@/types/auth/jwt";
import { LoginPayload } from "@/types/auth/payload";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const useLogin = (): ((values: LoginPayload) => void) => {
  const { toast } = useToast();
  const { setUser } = useUserContext();
  const router = useRouter();

  const mutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data: { token: string }) => {
      new TokenStorage(new LocalStorageStrategy()).save(data.token);
      new TokenStorage(new ClientCookieStorageStrategy()).save(data.token);
      const rawUser = new Token<JwtPayload>(data.token).decode().user;
      setUser(new User(rawUser));
      router.back();
      setTimeout(() => router.refresh(), 25);
      toast({ title: "Logged in successfully!" });
    },
    onError: (error: Error) => {
      if (error instanceof HttpError && error.details.status === 401) {
        toast({
          title: "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    },
  });
  const login = useCallback(
    (values: LoginPayload) => {
      mutation.mutate(values);
    },
    [mutation]
  );
  return login;
};

export default useLogin;
