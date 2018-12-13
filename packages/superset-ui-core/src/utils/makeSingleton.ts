interface IClass<T> {
  new (...args: any[]): T;
}

export default function makeSingleton<T>(BaseClass: IClass<T>, ...args): () => T {
  let singleton;

  return function getInstance() {
    if (!singleton) {
      singleton = new BaseClass(...args);
    }

    return singleton;
  };
}
