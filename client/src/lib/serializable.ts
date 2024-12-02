/* eslint-disable @typescript-eslint/no-explicit-any */
export class Serializable<T extends Record<string, any>> {
  protected rawData: T;

  constructor(rawData: T) {
    this.rawData = rawData;
  }

  toString(): string {
    return JSON.stringify(this.rawData);
  }

  static fromString<T extends Record<string, any>, U extends Serializable<T>>(
    this: new (rawData: T) => U,
    jsonString: string
  ): U {
    let parsedData: T;

    try {
      if (typeof jsonString === "string" && jsonString.trim()) {
        parsedData = JSON.parse(jsonString) as T;
      } else {
        parsedData = {} as T;
      }
    } catch {
      parsedData = {} as T;
    }

    return new this(parsedData);
  }
}
