interface ClassInterface<T> {
  new (...args: unknown[]): T;
}

export default function makeSingleton<T>(
  BaseClass: ClassInterface<T>,
  ...args: unknown[]
): () => T {
  let singleton: T;

  return function getInstance() {
    if (!singleton) {
      singleton = new BaseClass(...args);
    }

    return singleton;
  };
}
