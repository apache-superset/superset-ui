import { QueryFormDataMetric } from './QueryFormData';

export type GroupedControlData = {
  columns: string[];
  groupby: string[];
  metrics: QueryFormDataMetric[];
};
export type ResidualGroupedControlData = {
  [key: string]: QueryFormDataMetric[];
};
