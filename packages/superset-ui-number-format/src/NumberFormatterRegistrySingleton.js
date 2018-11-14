import { makeSingleton } from '@superset-ui/core';
import NumberFormatterRegistry from './NumberFormatterRegistry';

const getInstance = makeSingleton(NumberFormatterRegistry);

export default getInstance;

export function getFormatter(format) {
  return getInstance().get(format).format;
}

export function formatNumber(format, value) {
  return getInstance().format(format, value);
}
