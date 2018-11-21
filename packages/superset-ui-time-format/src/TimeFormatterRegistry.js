import { RegistryWithDefaultKey } from '@superset-ui/core';
import { DATABASE_DATETIME } from './TimeFormats';
import createD3TimeFormatter from './factories/createD3TimeFormatter';

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
    const useLocalTime = targetFormat.startsWith('local!');
    const formatString = targetFormat.replace(/^(local)[!]/, '');
    const formatter = createD3TimeFormatter({ formatString, useLocalTime });
    this.registerValue(targetFormat, formatter);

    return formatter;
  }

  format(format, value) {
    return this.get(format)(value);
  }
}
