import { JwtPayload } from "@/types/auth/jwt";
import { TokenStorage } from "../jwt/token-storage";
import { ServerCookieStorageStrategy } from "../storage/cookies/server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { Token } from "../jwt/token";
import { Serializable } from "../serializable";

export class User extends Serializable<JwtPayload["user"]> {
  constructor(private readonly rawUser: JwtPayload["user"]) {
    super(rawUser);
  }

  id(): string {
    return this.rawUser.id;
  }

  email(): string {
    return this.rawUser.email;
  }

  fullName(): string {
    return this.rawUser.fullName;
  }

  static async fromCookies(
    cookies: ReadonlyRequestCookies
  ): Promise<User | null> {
    const token = await new TokenStorage(
      new ServerCookieStorageStrategy().withCookies(cookies)
    ).load();
    return token ? new User(new Token<JwtPayload>(token).decode().user) : null;
  }
}
