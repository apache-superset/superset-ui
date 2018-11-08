import camelCase from 'lodash/camelCase';
import Registry from '../models/Registry';

export default function createRegistryWithDefaultKey({
  defaultKey = undefined,
  keyLabel = 'key',
  setFirstItemAsDefault = false,
} = {}) {
  class RegistryWithDefaultKey extends Registry {
    constructor(...args) {
      super(...args);
      this.defaultKey = defaultKey;
    }

    clear() {
      super.clear();
      this.defaultKey = defaultKey;

      return this;
    }

    get(key) {
      return super.get(key || this.defaultKey);
    }

    registerValue(key, value) {
      super.registerValue(key, value);
      // If there is no default, set as default
      if (setFirstItemAsDefault && !this.defaultKey) {
        this.defaultKey = key;
      }

      return this;
    }

    registerLoader(key, loader) {
      super.registerLoader(key, loader);
      // If there is no default, set as default
      if (setFirstItemAsDefault && !this.defaultKey) {
        this.defaultKey = key;
      }

      return this;
    }
  }

  RegistryWithDefaultKey.prototype[camelCase(`getDefault-${keyLabel}`)] = function getDefaultKey() {
    return this.defaultKey;
  };

  RegistryWithDefaultKey.prototype[camelCase(`setDefault-${keyLabel}`)] = function setDefaultKey(
    key,
  ) {
    this.defaultKey = key;

    return this;
  };

  return RegistryWithDefaultKey;
}
