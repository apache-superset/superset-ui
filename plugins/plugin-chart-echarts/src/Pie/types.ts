import { DataRecord } from '@superset-ui/chart';
import echarts from 'echarts';

export type EchartsPieProps = {
  height: number;
  width: number;
  data: DataRecord[]; // please add additional typing for your data here
  // add typing here for the props you pass in from transformProps.ts!
  echartOptions: echarts.EChartOption;
  innerRadius: number;
  outerRadius: number;
};
