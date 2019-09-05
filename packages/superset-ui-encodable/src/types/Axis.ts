/** See https://vega.github.io/vega-lite/docs/axis.html */

import { Axis as VegaLiteAxis } from './VegaLite';

/** Axis orientation */
export type AxisOrient = VegaLiteAxis['orient'];

/** Strategy for handling label overlap */
export type LabelOverlapStrategy = 'auto' | 'flat' | 'rotate';

export interface BaseAxisConfig
  extends Pick<
    VegaLiteAxis,
    | 'format'
    | 'labelAngle'
    | 'labelFlush'
    | 'labelPadding'
    | 'orient'
    | 'tickCount'
    | 'tickSize'
    | 'title'
    | 'values'
  > {
  /** Strategy for handling label overlap */
  labelOverlap?: LabelOverlapStrategy;
}

export interface XAxisConfig extends BaseAxisConfig {
  orient?: 'top' | 'bottom';
  labelAngle?: number;
  labelOverlap?: LabelOverlapStrategy;
}

export interface WithXAxis {
  axis?: Partial<XAxisConfig> | boolean;
}

export interface YAxisConfig extends BaseAxisConfig {
  orient?: 'left' | 'right';
  labelAngle?: 0;
  labelOverlap?: 'auto' | 'flat';
}

export interface WithYAxis {
  axis?: Partial<YAxisConfig> | boolean;
}

export type WithAxis = WithXAxis | WithYAxis;
