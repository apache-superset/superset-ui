/* eslint camelcase: 0 */
/* eslint-disable import/prefer-default-export */
// FormData uses snake_cased keys.
import { MetricKey, AdhocMetric } from './Metric';
import { AnnotationLayerMetadata } from './Annotation';
import { UnaryOperator, SetOperator, BinaryOperator, TimeRange } from './Common';

// Type signature and utility functions for formData shared by all viz types
// It will be gradually filled out as we build out the query object

export namespace ChartFormData {
  export type SimpleAdhocFilter = {
    expressionType: 'SIMPLE';
    clause: 'WHERE' | 'HAVING';
    subject: string;
  } & (
    | {
        operator: BinaryOperator;
        comparator: string;
      }
    | {
        operator: SetOperator;
        comparator: string[];
      }
    | {
        operator: UnaryOperator;
      });

  export interface FreeFormAdhocFilter {
    expressionType: 'SQL';
    clause: 'WHERE' | 'HAVING';
    sqlExpression: 'string';
  }

  export type AdhocFilter = SimpleAdhocFilter | FreeFormAdhocFilter;

  export type Metric = string | AdhocMetric;
}

// Define mapped type separately to work around a limitation of TypeScript
// https://github.com/Microsoft/TypeScript/issues/13573
// The Metrics in formData is either a string or a proper metric. It will be
// unified into a proper Metric type during buildQuery (see `/query/Metrics.ts`).
export type Metrics = Partial<Record<MetricKey, ChartFormData.Metric | ChartFormData.Metric[]>>;

export type BaseFormData = {
  datasource: string;
  viz_type: string;

  groupby?: string[];
  where?: string;
  columns?: string[];
  all_columns?: string[];
  adhoc_filters?: ChartFormData.AdhocFilter[];
  order_desc?: boolean;

  limit?: number;
  row_limit?: number;
  timeseries_limit_metric?: ChartFormData.Metric;

  annotation_layers?: AnnotationLayerMetadata[];
} & TimeRange &
  Metrics;

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
