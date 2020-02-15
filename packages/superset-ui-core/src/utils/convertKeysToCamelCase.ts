import camelCase from 'lodash-es/camelCase';
import isPlainObject from 'lodash-es/isPlainObject';
import mapKeys from 'lodash-es/mapKeys';

export default function convertKeysToCamelCase(object: unknown) {
  if (object === null || object === undefined) {
    return object;
  }
  if (isPlainObject(object)) {
    return mapKeys(object as { [key: string]: unknown }, (_, k) => camelCase(k));
  }
  throw new Error(`Cannot convert input that is not a plain object: ${object}`);
}
