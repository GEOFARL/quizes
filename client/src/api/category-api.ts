import { autobind } from "@/lib/autobind";
import { BaseApi } from "./base-api";

class CategoryApi extends BaseApi {
  constructor() {
    super(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
    autobind(this);
  }

  async getCategories(token?: string) {
    return this.fetch<{ data: { id: string; name: string; color: string }[] }>(
      "/",
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
  }
}

export const categoryApi = new CategoryApi();
