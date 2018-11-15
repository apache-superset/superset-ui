import { RegistryWithDefaultKey } from '@superset-ui/core';
import D3TimeFormatter from './formatters/D3TimeFormatter';
import { DATABASE_DATETIME } from './TimeFormats';

const DEFAULT_FORMAT = DATABASE_DATETIME;

export default class TimeFormatterRegistry extends RegistryWithDefaultKey {
  constructor() {
    super({
      initialDefaultKey: DEFAULT_FORMAT,
      name: 'TimeFormatter',
    });
  }

  get(format) {
    const targetFormat = format || this.defaultKey;

    if (this.has(targetFormat)) {
      return super.get(targetFormat);
    }

    // Create new formatter if does not exist
    const formatter = new D3TimeFormatter(targetFormat);
    this.registerValue(targetFormat, formatter);

    return formatter;
  }

  format(format, value) {
    return this.get(format)(value);
  }
}
