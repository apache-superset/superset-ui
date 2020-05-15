import { QueryFields, QueryFormResidualData } from './types/QueryFormData';
import { QueryFieldData } from './types/Query';

export default function buildQueryFieldData(
  residualFormData: QueryFormResidualData,
  queryFields?: QueryFields,
) {
  const queryFieldAliases: QueryFields = {
    /** These are predefined for backward compatibility */
    metric: 'metrics',
    percent_metrics: 'metrics',
    metric_2: 'metrics',
    secondary_metric: 'metrics',
    x: 'metrics',
    y: 'metrics',
    size: 'metrics',
    ...queryFields,
  };
  const finalQueryFields: QueryFieldData = {
    columns: [],
    groupby: [],
    metrics: [],
  };
  Object.entries(residualFormData).forEach(entry => {
    const [key, residualValue] = entry;
    const normalizedKey = Object.prototype.hasOwnProperty.call(queryFieldAliases, key)
      ? queryFieldAliases[key]
      : key;
    finalQueryFields[normalizedKey] = (finalQueryFields[normalizedKey] || []).concat(residualValue);
  });
  return finalQueryFields;
}
