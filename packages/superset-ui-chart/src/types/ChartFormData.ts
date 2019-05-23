/* eslint camelcase: 0 */
/* eslint-disable import/prefer-default-export */
// FormData uses snake_cased keys.
import { MetricKey, AdhocMetric } from './Metric';
import { AnnotationLayerMetadata } from './Annotation';
import { TimeRange } from './Time';
import { AdhocFilter } from './Filter';

export type ChartFormDataMetric = string | AdhocMetric;

// Define mapped type separately to work around a limitation of TypeScript
// https://github.com/Microsoft/TypeScript/issues/13573
// The Metrics in formData is either a string or a proper metric. It will be
// unified into a proper Metric type during buildQuery (see `/query/Metrics.ts`).
export type ChartFormDataMetrics = Partial<
  Record<MetricKey, ChartFormDataMetric | ChartFormDataMetric[]>
>;

// Type signature for formData shared by all viz types
// It will be gradually filled out as we build out the query object

export type BaseFormData = {
  datasource: string;
  viz_type: string;

  groupby?: string[];
  where?: string;
  columns?: string[];
  all_columns?: string[];
  adhoc_filters?: AdhocFilter[];
  order_desc?: boolean;

  limit?: number;
  row_limit?: number;
  timeseries_limit_metric?: ChartFormDataMetric;

  annotation_layers?: AnnotationLayerMetadata[];
} & TimeRange &
  ChartFormDataMetrics;

// FormData is either sqla-based or druid-based
export type SqlaFormData = {
  granularity_sqla: string;
  time_grain_sqla?: string;
  having?: string;
} & BaseFormData;

export type DruidFormData = {
  granularity: string;
  having_druid?: string;
  druid_time_origin?: string;
} & BaseFormData;

export type ChartFormData = SqlaFormData | DruidFormData;

//---------------------------------------------------
// Type guards
//---------------------------------------------------

export function isDruidFormData(formData: ChartFormData): formData is DruidFormData {
  return 'granularity' in formData;
}

export function isSqlaFormData(formData: ChartFormData): formData is SqlaFormData {
  return 'granularity_sqla' in formData;
}
