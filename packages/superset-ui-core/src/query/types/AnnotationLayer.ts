/* eslint camelcase: 0 */
type BaseAnnotationLayer = {
  color?: string | null;
  name: string;
  opacity?: '' | 'opacityLow' | 'opacityMedium' | 'opacityHigh';
  show: boolean;
  sourceType?: '';
  style: 'dashed' | 'dotted' | 'solid' | 'longDashed';
  width?: number;
};

type AnnotationOverrides = {
  granularity?: string | null;
  time_grain_sqla?: string | null;
  time_range?: string | null;
  time_shift?: string | null;
};

type LineSourceAnnotationLayer = {
  hideLine?: boolean;
  overrides?: AnnotationOverrides;
  sourceType: 'line';
  titleColumn: string;
  // viz id
  value: number;
};

type NativeSourceAnnotationLayer = {
  sourceType: 'NATIVE';
  // annotation id
  value: number;
};

type TableSourceAnnotationLayer = {
  descriptionColumns?: string[];
  timeColumn?: string;
  intervalEndColumn?: string;
  overrides?: AnnotationOverrides;
  sourceType: 'table';
  titleColumn?: string;
  // viz id
  value: number;
};

export type EventAnnotationLayer = BaseAnnotationLayer &
  (TableSourceAnnotationLayer | NativeSourceAnnotationLayer) & {
    annotationType: 'EVENT';
  };

export type IntervalAnnotationLayer = BaseAnnotationLayer &
  (TableSourceAnnotationLayer | NativeSourceAnnotationLayer) & {
    annotationType: 'INTERVAL';
  };

export type FormulaAnnotationLayer = BaseAnnotationLayer & {
  annotationType: 'FORMULA';
  // the mathjs parseable formula
  value: string;
};

export type TimeseriesAnnotationLayer = BaseAnnotationLayer &
  LineSourceAnnotationLayer & {
    annotationType: 'TIME_SERIES';
    showMarkers?: boolean;
    value: number;
  };

export type AnnotationLayer =
  | EventAnnotationLayer
  | IntervalAnnotationLayer
  | FormulaAnnotationLayer
  | TimeseriesAnnotationLayer;
