import {
  ScaleOrdinal,
  ScaleLinear,
  ScaleLogarithmic,
  ScalePower,
  ScaleTime,
  ScaleQuantile,
  ScaleQuantize,
  ScaleThreshold,
  ScalePoint,
  ScaleBand,
} from 'd3-scale';
import { Value, DateTime, ScaleType, SchemeParams } from './VegaLite';

export interface Scale<Output extends Value = Value> {
  type?: ScaleType;
  domain?: number[] | string[] | boolean[] | DateTime[];
  paddingInner?: number;
  paddingOuter?: number;
  range?: Output[];
  clamp?: boolean;
  nice?: boolean;
  /** color scheme name */
  scheme?: string | SchemeParams;
  /** vega-lite does not have this */
  namespace?: string;
}

export interface WithScale<Output extends Value = Value> {
  scale?: Scale<Output>;
}

export interface ScaleTypeToD3ScaleType<Output extends Value = Value> {
  [ScaleType.LINEAR]: ScaleLinear<Output, Output>;
  [ScaleType.LOG]: ScaleLogarithmic<Output, Output>;
  [ScaleType.POW]: ScalePower<Output, Output>;
  [ScaleType.SQRT]: ScalePower<Output, Output>;
  [ScaleType.SYMLOG]: ScaleLogarithmic<Output, Output>;
  [ScaleType.TIME]: ScaleTime<Output, Output>;
  [ScaleType.UTC]: ScaleTime<Output, Output>;
  [ScaleType.QUANTILE]: ScaleQuantile<Output>;
  [ScaleType.QUANTIZE]: ScaleQuantize<Output>;
  [ScaleType.THRESHOLD]: ScaleThreshold<number | string | Date, Output>;
  [ScaleType.BIN_ORDINAL]: ScaleOrdinal<{ toString(): string }, Output>;
  [ScaleType.ORDINAL]: ScaleOrdinal<{ toString(): string }, Output>;
  [ScaleType.POINT]: ScalePoint<{ toString(): string }>;
  [ScaleType.BAND]: ScaleBand<{ toString(): string }>;
}

/** Each ScaleCategory contains one or more ScaleType */
export type ScaleCategory = 'continuous' | 'discrete' | 'discretizing';
