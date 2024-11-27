/* eslint-disable @typescript-eslint/no-explicit-any */
export function autobind<T extends object>(instance: T): void {
  const prototype = Object.getPrototypeOf(instance);
  const propertyNames = Object.getOwnPropertyNames(prototype) as (keyof T)[];

  propertyNames.forEach((propertyName) => {
    const descriptor = Object.getOwnPropertyDescriptor(prototype, propertyName);

    if (
      descriptor &&
      typeof descriptor.value === "function" &&
      propertyName !== "constructor"
    ) {
      const method = descriptor.value as (...args: any[]) => any;
      (instance[propertyName] as unknown as (...args: any[]) => any) =
        method.bind(instance);
    }
  });
}
