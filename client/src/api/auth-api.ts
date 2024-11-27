import { RegisterPayload } from "@/types/auth/payload";
import { RegisterResponse } from "@/types/auth/response";
import { BaseApi } from "./base-api";
import { autobind } from "@/lib/autobind";

class AuthApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}/auth`);
    autobind(this);
  }

  async register(payload: RegisterPayload): Promise<RegisterResponse> {
    return this.fetch<RegisterResponse>("/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
}

export const authApi = new AuthApi();
