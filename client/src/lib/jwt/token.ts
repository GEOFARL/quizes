import { jwtDecode, JwtPayload } from "jwt-decode";

export class Token<T extends { exp?: number } = JwtPayload> {
  private readonly value: string;

  constructor(token: string) {
    this.value = token;
  }

  decode(): T {
    try {
      return jwtDecode<T>(this.value);
    } catch {
      throw new Error("Invalid token format.");
    }
  }

  isExpired(): boolean {
    const decoded = this.decode();
    if (!decoded || typeof decoded.exp !== "number") return true;

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currentTime;
  }

  getRawValue(): string {
    return this.value;
  }
}
