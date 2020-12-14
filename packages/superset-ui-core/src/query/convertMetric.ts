import { QueryFormMetric } from './types/QueryFormData';
import { QueryObjectMetric } from './types/Query';
import { AdhocMetric, PredefinedMetric } from './types/Metric';

function getMetricLabel(metric: AdhocMetric | PredefinedMetric) {
  if (metric.label) {
    return metric.label;
  }
  if ('metric_name' in metric) {
    return metric.metric_name;
  }
  if (metric.expressionType === 'SIMPLE') {
    return `${metric.aggregate}(${metric.column.columnName})`;
  }
  return metric.sqlExpression;
}

export default function convertMetric(metric: QueryFormMetric): QueryObjectMetric {
  if (typeof metric === 'string') {
    return {
      label: metric,
      metric_name: metric,
    };
  }
  return {
    ...metric,
    label: getMetricLabel(metric),
  };
}
