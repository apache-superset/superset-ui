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
import { Value, DateTime, ScaleType, Scale as VegaLiteScale } from './VegaLite';
import { HasToString } from './Base';

// Pick fields inherited from vega-lite
// and overrides a few fields.
// Then make the specific scales pick
// from this base interface to share field documentation
// (which is useful for auto-complete)
// and add `type` field as discriminant.

interface BaseScale<Output extends Value = Value>
  extends Pick<
    VegaLiteScale,
    | 'align'
    | 'base'
    | 'bins'
    | 'clamp'
    | 'constant'
    | 'exponent'
    | 'interpolate'
    | 'nice'
    | 'padding'
    | 'paddingInner'
    | 'paddingOuter'
    | 'reverse'
    | 'round'
    | 'scheme'
    | 'zero'
  > {
  // These fields have different types from original vega-lite
  domain?: number[] | string[] | boolean[] | DateTime[];
  range?: Output[];
  // vega-lite does not have this field
  /** color namespace */
  namespace?: string;
}

export interface LinearScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    | 'domain'
    | 'range'
    | 'reverse'
    | 'clamp'
    | 'interpolate'
    | 'nice'
    | 'padding'
    | 'round'
    | 'scheme'
    | 'zero'
  > {
  type: 'linear';
}

export interface LogScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    | 'bins'
    | 'clamp'
    | 'exponent'
    | 'interpolate'
    | 'nice'
    | 'padding'
    | 'reverse'
    | 'round'
    | 'scheme'
    | 'zero'
  > {
  type: 'log';
}

export interface PowScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    'base' | 'bins' | 'clamp' | 'interpolate' | 'nice' | 'padding' | 'reverse' | 'round' | 'scheme'
  > {
  type: 'pow';
}

export interface SqrtScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    'bins' | 'clamp' | 'interpolate' | 'nice' | 'padding' | 'reverse' | 'round' | 'scheme' | 'zero'
  > {
  type: 'sqrt';
}

export interface SymlogScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    | 'bins'
    | 'clamp'
    | 'constant'
    | 'interpolate'
    | 'nice'
    | 'padding'
    | 'reverse'
    | 'round'
    | 'scheme'
    | 'zero'
  > {
  type: 'symlog';
}

export interface TimeScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    'bins' | 'clamp' | 'interpolate' | 'nice' | 'padding' | 'reverse' | 'round' | 'scheme'
  > {
  type: 'time';
}

export interface UtcScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    'bins' | 'clamp' | 'interpolate' | 'nice' | 'padding' | 'reverse' | 'round' | 'scheme'
  > {
  type: 'utc';
}

export interface QuantileScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'bins' | 'interpolate' | 'reverse' | 'scheme'> {
  type: 'quantile';
}

export interface QuantizeScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'bins' | 'interpolate' | 'nice' | 'reverse' | 'scheme' | 'zero'> {
  type: 'quantize';
}

export interface ThresholdScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'bins' | 'interpolate' | 'nice' | 'reverse' | 'scheme'> {
  type: 'threshold';
}

export interface BinOrdinalScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'bins' | 'interpolate' | 'reverse' | 'scheme'> {
  type: 'bin_ordinal';
}

export interface OrdinalScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'interpolate' | 'reverse' | 'scheme'> {
  type: 'ordinal';
}

export interface PointScaleConfig<Output extends Value = Value>
  extends Pick<BaseScale<Output>, 'align' | 'padding' | 'paddingOuter' | 'reverse' | 'round'> {
  type: 'point';
}

export interface BandScaleConfig<Output extends Value = Value>
  extends Pick<
    BaseScale<Output>,
    'align' | 'padding' | 'paddingInner' | 'paddingOuter' | 'reverse' | 'round'
  > {
  type: 'band';
}

export type Scale<Output extends Value = Value> =
  | LinearScaleConfig<Output>
  | LogScaleConfig<Output>
  | PowScaleConfig<Output>
  | SqrtScaleConfig<Output>
  | SymlogScaleConfig<Output>
  | TimeScaleConfig<Output>
  | UtcScaleConfig<Output>
  | QuantileScaleConfig<Output>;

export interface WithScale<Output extends Value = Value> {
  scale?: Partial<Scale<Output>>;
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
  [ScaleType.BIN_ORDINAL]: ScaleOrdinal<HasToString, Output>;
  [ScaleType.ORDINAL]: ScaleOrdinal<HasToString, Output>;
  [ScaleType.POINT]: ScalePoint<HasToString>;
  [ScaleType.BAND]: ScaleBand<HasToString>;
}

/** Each ScaleCategory contains one or more ScaleType */
export type ScaleCategory = 'continuous' | 'discrete' | 'discretizing';
