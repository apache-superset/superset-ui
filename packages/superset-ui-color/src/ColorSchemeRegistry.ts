import { RegistryWithDefaultKey } from '@superset-ui/core';
import ColorScheme from './ColorScheme';

export default class ColorSchemeRegistry<T> extends RegistryWithDefaultKey<T> {
  constructor() {
    super({
      name: 'ColorScheme',
      setFirstItemAsDefault: true,
    });
  }
}
