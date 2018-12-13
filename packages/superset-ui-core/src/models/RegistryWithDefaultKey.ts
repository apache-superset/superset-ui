import Registry from './Registry';

export default class RegistryWithDefaultKey extends Registry {
  initialDefaultKey?: string;
  defaultKey?: string;
  setFirstItemAsDefault: boolean;

  constructor({ initialDefaultKey = undefined, setFirstItemAsDefault = false, ...rest } = {}) {
    super(rest);
    this.initialDefaultKey = initialDefaultKey;
    this.defaultKey = initialDefaultKey;
    this.setFirstItemAsDefault = setFirstItemAsDefault;
  }

  clear() {
    super.clear();
    this.defaultKey = this.initialDefaultKey;

    return this;
  }

  get(key) {
    return super.get(key || this.defaultKey);
  }

  registerValue(key: string, value: any) {
    super.registerValue(key, value);
    // If there is no default, set as default
    if (this.setFirstItemAsDefault && !this.defaultKey) {
      this.defaultKey = key;
    }

    return this;
  }

  registerLoader(key: string, loader: () => any) {
    super.registerLoader(key, loader);
    // If there is no default, set as default
    if (this.setFirstItemAsDefault && !this.defaultKey) {
      this.defaultKey = key;
    }

    return this;
  }

  getDefaultKey() {
    return this.defaultKey;
  }

  setDefaultKey(key: string) {
    this.defaultKey = key;

    return this;
  }
}
