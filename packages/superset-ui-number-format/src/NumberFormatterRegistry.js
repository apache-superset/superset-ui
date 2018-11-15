import { RegistryWithDefaultKey } from '@superset-ui/core';
import NumberFormatter from './NumberFormatter';
import { SI_3_POINT } from './formats';

const DEFAULT_FORMAT = SI_3_POINT;

export default class NumberFormatterRegistry extends RegistryWithDefaultKey {
  constructor() {
    super({
      initialDefaultKey: DEFAULT_FORMAT,
      name: 'NumberFormatter',
    });
  }

  get(format) {
    const targetFormat = format || this.defaultKey;

    if (this.has(targetFormat)) {
      return super.get(targetFormat);
    }

    // Create new formatter if does not exist
    const formatter = new NumberFormatter(targetFormat);
    this.registerValue(targetFormat, formatter);

    return formatter;
  }

  format(format, value) {
    return this.get(format)(value);
  }
}
