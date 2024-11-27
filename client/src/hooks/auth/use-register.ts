import { authApi } from "@/api/auth-api";
import { useUserContext } from "@/components/providers/UserProvider";
import usePathWithLocale from "@/hooks/use-path-with-locale";
import { useToast } from "@/hooks/use-toast";
import { Token } from "@/lib/jwt/token";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { ClientCookieStorageStrategy } from "@/lib/storage/cookies/client";
import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { User } from "@/lib/user/user";
import { JwtPayload } from "@/types/auth/jwt";
import { RegisterPayload } from "@/types/auth/payload";
import { useMutation } from "@tanstack/react-query";
import { useCallback } from "react";

const useRegister = (): ((values: RegisterPayload) => void) => {
  const { toast } = useToast();
  const { setUser } = useUserContext();
  const constructPath = usePathWithLocale();

  const mutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data: { token: string }) => {
      new TokenStorage(new LocalStorageStrategy()).save(data.token);
      new TokenStorage(new ClientCookieStorageStrategy()).save(data.token);
      const rawUser = new Token<JwtPayload>(data.token).decode().user;
      setUser(new User(rawUser));
      toast({ title: "Successfully registered!" });
      window.location.replace(constructPath("/"));
    },
  });
  const register = useCallback(
    (values: RegisterPayload) => {
      mutation.mutate(values);
    },
    [mutation]
  );
  return register;
};

export default useRegister;
