export interface StorageStrategy {
  setItem(key: string, value: string): void;
  getItem(key: string): (string | null) | Promise<string | null>;
  removeItem(key: string): void;
}

export class BaseStorage<T> {
  private readonly storageStrategy: StorageStrategy;
  private readonly key: string;

  constructor(storageStrategy: StorageStrategy, key: string) {
    this.storageStrategy = storageStrategy;
    this.key = key;
  }

  save(value: T): void {
    const serializedValue = JSON.stringify(value);
    this.storageStrategy.setItem(this.key, serializedValue);
  }

  async load(): Promise<T | null> {
    const serializedValue = await this.storageStrategy.getItem(this.key);
    return serializedValue ? JSON.parse(serializedValue) : null;
  }

  clear(): void {
    this.storageStrategy.removeItem(this.key);
  }
}

export default BaseStorage;
