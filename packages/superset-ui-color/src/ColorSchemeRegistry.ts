import { RegistryWithDefaultKey } from '@superset-ui/core';

export default class ColorSchemeRegistry<T> extends RegistryWithDefaultKey<T> {
  constructor() {
    super({
      name: 'ColorScheme',
      setFirstItemAsDefault: true,
    });
  }

  get(key?: string): T | undefined {
    return super.get(key) as T | undefined;
  }
}
