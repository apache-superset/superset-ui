import { Axis } from '../types/Axis';

// eslint-disable-next-line import/prefer-default-export
export function isAxis(axis: Axis | null | undefined | false): axis is Axis {
  return axis !== false && axis !== null && axis !== undefined;
}
