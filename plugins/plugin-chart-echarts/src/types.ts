import { DataRecord } from '@superset-ui/chart';
import ECharts from 'echarts';

export type TimestampType = string | number | Date;

export interface EchartsTimeseriesRawDatum extends DataRecord {
  __timestamp: TimestampType;
}

export interface EchartsTimeseriesDatum extends DataRecord {
  __timestamp: Date;
}

export type EchartsLineProps = {
  area: number;
  colorScheme: string;
  contributionMode?: string;
  zoomable?: boolean;
  height: number;
  seriesType: string;
  logAxis: boolean;
  width: number;
  stack: boolean;
  markerEnabled: boolean;
  markerSize: number;
  minorSplitLine: boolean;
  opacity: number;
  data: EchartsTimeseriesDatum[]; // please add additional typing for your data here
  // add typing here for the props you pass in from transformProps.ts!
  echartOptions: ECharts.EChartOption;
};
