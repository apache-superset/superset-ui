import camelCase from 'lodash-es/camelCase';
import isPlainObject from 'lodash-es/isPlainObject';
import mapKeys from 'lodash-es/mapKeys';

export default function convertKeysToCamelCase(object: unknown) {
  if (object === null || object === undefined) {
    return object;
  }
  if (isPlainObject(object)) {
    // TODO: Change any to unknown and fix the consequences
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return mapKeys(object as { [key: string]: any }, (_, k) => camelCase(k));
  }
  throw new Error(`Cannot convert input that is not a plain object: ${object}`);
}
