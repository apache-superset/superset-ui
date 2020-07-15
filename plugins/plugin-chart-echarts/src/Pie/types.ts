import { DataRecord, ChartProps } from '@superset-ui/chart';

export interface PieChartFormData {
  groupby?: string[];
  metrics?: string[];
  outerRadius?: number;
  innerRadius?: number;
}

export interface EchartsPieProps<D extends DataRecord = DataRecord> extends ChartProps {
  formData: PieChartFormData;
  queryData: ChartProps['queryData'] & {
    data?: D[];
  };
}
