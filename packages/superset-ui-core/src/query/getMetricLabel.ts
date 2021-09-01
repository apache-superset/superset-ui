import { isAdhocMetricSimple, isSavedMetric, QueryFormMetric } from './types';

export default function getMetricLabel(metric: QueryFormMetric): string {
  if (isSavedMetric(metric)) {
    return metric;
  }
  if (metric.label) {
    return metric.label;
  }
  if (isAdhocMetricSimple(metric)) {
    return `${metric.aggregate}(${metric.column.columnName || metric.column.column_name})`;
  }
  return metric.sqlExpression;
}
