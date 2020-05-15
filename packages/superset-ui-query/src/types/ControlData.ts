import { QueryFormDataMetric, QueryFormResidualDataValue } from './QueryFormData';

export type GroupedControlData = {
  columns: QueryFormResidualDataValue[];
  groupby: QueryFormResidualDataValue[];
  metrics: QueryFormDataMetric[];
  [key: string]: QueryFormResidualDataValue[];
};
