/* eslint camelcase: 0 */

import { DataRecord } from '../../chart';

export type AnnotationOpacity = '' | 'opacityLow' | 'opacityMedium' | 'opacityHigh';

type BaseAnnotationLayer = {
  color?: string | null;
  name: string;
  opacity?: AnnotationOpacity;
  show: boolean;
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
  titleColumn?: string;
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

export type TableAnnotationLayer = BaseAnnotationLayer &
  TableSourceAnnotationLayer & {
    annotationType: 'EVENT' | 'INTERVAL';
  };

export type FormulaAnnotationLayer = BaseAnnotationLayer & {
  annotationType: 'FORMULA';
  // the mathjs parseable formula
  sourceType?: '';
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

export function isFormulaAnnotationLayer(layer: AnnotationLayer): layer is FormulaAnnotationLayer {
  return layer.annotationType === 'FORMULA';
}

export function isEventAnnotationLayer(layer: AnnotationLayer): layer is EventAnnotationLayer {
  return layer.annotationType === 'EVENT';
}

export function isIntervalAnnotationLayer(
  layer: AnnotationLayer,
): layer is IntervalAnnotationLayer {
  return layer.annotationType === 'INTERVAL';
}

export function isTimeseriesAnnotationLayer(
  layer: AnnotationLayer,
): layer is TimeseriesAnnotationLayer {
  return layer.annotationType === 'TIME_SERIES';
}

export function isTableAnnotationLayer(layer: AnnotationLayer): layer is TableAnnotationLayer {
  return layer.sourceType === 'table';
}

export type RecordAnnotationResult = {
  columns: string[];
  records: DataRecord[];
};

export type TimeseriesAnnotationResult = [
  { key: string; values: { x: string | number; y?: number }[] },
];

export type AnnotationResult = RecordAnnotationResult | TimeseriesAnnotationResult;

export function isTimeseriesAnnotationResult(
  result: AnnotationResult,
): result is TimeseriesAnnotationResult {
  return Array.isArray(result);
}

export function isRecordAnnotationResult(
  result: AnnotationResult,
): result is RecordAnnotationResult {
  return 'columns' in result;
}

export type AnnotationData = { [key: string]: AnnotationResult };

export type Annotation = {
  descriptions?: string[];
  intervalEnd?: string;
  time?: string;
  title?: string;
};
