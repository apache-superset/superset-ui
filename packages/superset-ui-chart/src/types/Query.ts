/* eslint camelcase: 0 */
import ChartProps from '../models/ChartProps';
import { DatasourceType } from './Datasource';
import { ChartFormData } from './ChartFormData';
import { Metric } from './Metric';

export interface QueryObject {
  granularity: string;
  groupby?: string[];
  metrics?: Metric[];
  extras?: any;
  timeseries_limit?: number;
  timeseries_limit_metric?: Metric | null;
  time_range?: string;
  since?: string;
  until?: string;
  row_limit?: number;
  order_desc?: boolean;
  is_timeseries?: boolean;
  prequeries?: any[];
  is_prequery?: boolean;
  orderby?: any[];
}

export interface QueryContext {
  datasource: {
    id: number;
    type: DatasourceType;
  };
  queries: QueryObject[];
}

export type BuildQueryFunction<T extends ChartFormData> = (formData: T) => QueryContext;

export type TransformPropsFunction = (
  chartProps: ChartProps,
) => {
  [key: string]: any;
};
