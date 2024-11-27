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
    const parsedData = JSON.parse(jsonString) as T;
    return new this(parsedData);
  }
}
