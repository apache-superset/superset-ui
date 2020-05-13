import { QueryFormDataMetric } from './types/QueryFormData';
import { QueryObjectMetric } from './types/Query';
import convertMetric from './convertMetric';

export default function processMetrics(rawMetrics: QueryFormDataMetric[]) {
  const metrics: QueryObjectMetric[] = [];
  Object.values(rawMetrics).forEach(metric => {
    metrics.push(convertMetric(metric));
  });
  return metrics;
}
