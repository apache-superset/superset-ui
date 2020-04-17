import camelCase from 'lodash-es/camelCase';
import isPlainObject from 'lodash-es/isPlainObject';
import mapKeys from 'lodash-es/mapKeys';

// TODO: Change any to unknown and fix the consequences
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PlainObject = { [key: string]: any };

export default function convertKeysToCamelCase<T>(object: T): T {
  if (object === null || object === undefined) {
    return object;
  }
  if (isPlainObject(object)) {
    return mapKeys(object as PlainObject, (_, k) => camelCase(k)) as T;
  }
  throw new Error(`Cannot convert input that is not a plain object: ${object}`);
}
