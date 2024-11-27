import { StorageStrategy } from "../storage";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

export class ServerCookieStorageStrategy implements StorageStrategy {
  private cookies: ReadonlyRequestCookies | null = null;

  async setItem(key: string, value: string): Promise<void> {
    this.cookies?.set(key, value);
  }

  async getItem(key: string): Promise<string | null> {
    return this.cookies?.get(key)?.value || null;
  }

  async removeItem(key: string): Promise<void> {
    this.cookies?.delete(key);
  }

  withCookies(cookies: ReadonlyRequestCookies): ServerCookieStorageStrategy {
    this.cookies = cookies;
    return this;
  }
}
