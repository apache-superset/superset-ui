import { ChartFormData, ChartFormDataMetric } from '../types/ChartFormData';
import { MetricKey } from '../types/formData/Metric';
import { QueryObjectMetric } from '../types/Query';
import convertMetric from './convertMetric';

export default class Metrics {
  // Use Array to maintain insertion order for metrics that are order sensitive
  private metrics: QueryObjectMetric[];

  constructor(formData: ChartFormData) {
    this.metrics = [];
    Object.keys(MetricKey).forEach(key => {
      const metric = formData[MetricKey[key as keyof typeof MetricKey]];
      if (metric) {
        if (Array.isArray(metric)) {
          metric.forEach(m => this.addMetric(m));
        } else {
          this.addMetric(metric);
        }
      }
    });
  }

  public getMetrics() {
    return this.metrics;
  }

  public getLabels() {
    return this.metrics.map(m => m.label);
  }

  private addMetric(metric: ChartFormDataMetric) {
    this.metrics.push(convertMetric(metric));
  }
}
