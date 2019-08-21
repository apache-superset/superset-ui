import {
  scaleLinear,
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
  scaleOrdinal,
  scalePoint,
  scaleBand,
} from 'd3-scale';
import { ScaleType } from '../types/VegaLite';
import { HasToString } from '../types/Base';

// eslint-disable-next-line complexity
export default function createScaleFromScaleType<Output>(type: ScaleType) {
  switch (type) {
    case ScaleType.LINEAR:
      return scaleLinear<Output>();
    case ScaleType.LOG:
      return scaleLog<Output>();
    case ScaleType.POW:
      return scalePow<Output>();
    case ScaleType.SQRT:
      return scaleSqrt<Output>();
    case ScaleType.TIME:
      return scaleTime<Output>();
    case ScaleType.UTC:
      return scaleUtc<Output>();
    case ScaleType.QUANTILE:
      return scaleQuantile<Output>();
    case ScaleType.QUANTIZE:
      return scaleQuantize<Output>();
    case ScaleType.THRESHOLD:
      return scaleThreshold<number | string | Date, Output>();
    case ScaleType.BIN_ORDINAL:
    case ScaleType.ORDINAL:
      return scaleOrdinal<HasToString, Output>();
    case ScaleType.POINT:
      return scalePoint<HasToString>();
    case ScaleType.BAND:
      return scaleBand<HasToString>();
    default:
      return undefined;
  }
}
