"use client";

import { Token } from "@/lib/jwt/token";
import { TokenStorage } from "@/lib/jwt/token-storage";
import { LocalStorageStrategy } from "@/lib/storage/local-storage";
import { User } from "@/lib/user/user";
import { JwtPayload } from "@/types/auth/jwt";
import {
  createContext,
  PropsWithChildren,
  use,
  useEffect,
  useState,
} from "react";

const defaultValue = {
  user: null,
  setUser: () => {},
};

const UserContext = createContext<{
  user: User | null;
  setUser: (user: User | null) => void;
}>(defaultValue);

export const UserProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      const tokenStorage = new TokenStorage(new LocalStorageStrategy());
      const token = await tokenStorage.load();
      if (!token) {
        return;
      }
      const jwt = new Token<JwtPayload>(token);
      if (jwt.isExpired()) {
        tokenStorage.clear();
        return;
      }
      setUser(new User(jwt.decode().user));
    })();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return use(UserContext);
};
