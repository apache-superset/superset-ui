/* eslint no-console: 0 */

export enum OverwritePolicy {
  ALLOW = 'ALLOW',
  PROHIBIT = 'PROHIBIT',
  WARN = 'WARN',
}

export default class Registry {
  name: string;
  overwritePolicy: OverwritePolicy;
  items: {
    [key: string]: any;
  };

  promises: {
    [key: string]: Promise<any>;
  };

  constructor({ name = '', overwritePolicy = OverwritePolicy.ALLOW } = {}) {
    this.overwritePolicy = overwritePolicy;
    this.name = name;
    this.items = {};
    this.promises = {};
  }

  clear() {
    this.items = {};
    this.promises = {};

    return this;
  }

  has(key: string) {
    const item = this.items[key];

    return item !== null && item !== undefined;
  }

  registerValue(key: string, value): Registry {
    const item = this.items[key];
    if (item && item.value !== value) {
      if (this.overwritePolicy === OverwritePolicy.WARN) {
        console.warn(`Item with key "${key}" already exists. You are assigning a new value.`);
      } else if (this.overwritePolicy === OverwritePolicy.PROHIBIT) {
        throw new Error(`Item with key "${key}" already exists. Cannot overwrite.`);
      }
    }
    if (!item || item.value !== value) {
      this.items[key] = { value };
      delete this.promises[key];
    }

    return this;
  }

  registerLoader(key: string, loader: () => any): Registry {
    const item = this.items[key];
    if (item && item.loader !== loader) {
      if (this.overwritePolicy === OverwritePolicy.WARN) {
        console.warn(`Item with key "${key}" already exists. You are assigning a new value.`);
      } else if (this.overwritePolicy === OverwritePolicy.PROHIBIT) {
        throw new Error(`Item with key "${key}" already exists. Cannot overwrite.`);
      }
    }
    if (!item || item.loader !== loader) {
      this.items[key] = { loader };
      delete this.promises[key];
    }

    return this;
  }

  get(key: string): any {
    const item = this.items[key];
    if (item) {
      return item.loader ? item.loader() : item.value;
    }

    return null;
  }

  getAsPromise(key: string): Promise<any> {
    const promise = this.promises[key];
    if (promise) {
      return promise;
    }
    const item = this.get(key);
    if (item) {
      const newPromise = Promise.resolve(item);
      this.promises[key] = newPromise;

      return newPromise;
    }

    return Promise.reject(new Error(`Item with key "${key}" is not registered.`));
  }

  getMap(): {
    [key: string]: any;
  } {
    return this.keys().reduce((prev, key) => {
      const map = prev;
      map[key] = this.get(key);

      return map;
    }, {});
  }

  getMapAsPromise(): Promise<{
    [key: string]: any;
  }> {
    const keys = this.keys();

    return Promise.all(keys.map(key => this.getAsPromise(key))).then(values =>
      values.reduce((prev, value, i) => {
        const map = prev;
        map[keys[i]] = value;

        return map;
      }, {}),
    );
  }

  keys(): Array<string> {
    return Object.keys(this.items);
  }

  values(): Array<any> {
    return this.keys().map(key => this.get(key));
  }

  valuesAsPromise(): Promise<Array<any>> {
    return Promise.all(this.keys().map(key => this.getAsPromise(key)));
  }

  entries(): Array<{ key: string; value: any }> {
    return this.keys().map(key => ({
      key,
      value: this.get(key),
    }));
  }

  entriesAsPromise(): Promise<Array<{ key: string; value: any }>> {
    const keys = this.keys();

    return Promise.all(keys.map(key => this.getAsPromise(key))).then(values =>
      values.map((value, i) => ({
        key: keys[i],
        value,
      })),
    );
  }

  remove(key: string): Registry {
    delete this.items[key];
    delete this.promises[key];

    return this;
  }
}
