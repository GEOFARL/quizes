import { StorageStrategy } from "../storage";
import Cookies from "js-cookie";

export class ClientCookieStorageStrategy implements StorageStrategy {
  setItem(key: string, value: string): void {
    Cookies.set(key, value, { expires: 7, path: "/" });
  }

  getItem(key: string): string | null {
    return Cookies.get(key) || null;
  }

  removeItem(key: string): void {
    Cookies.remove(key, { path: "/" });
  }
}
