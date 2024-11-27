import BaseStorage, { StorageStrategy } from "../storage/storage";

export class TokenStorage extends BaseStorage<string> {
  constructor(storageStrategy: StorageStrategy, key: string = "authToken") {
    super(storageStrategy, key);
  }
}
