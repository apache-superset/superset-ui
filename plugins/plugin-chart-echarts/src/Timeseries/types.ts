import { DataRecord, DataRecordValue } from '@superset-ui/chart';
import echarts from 'echarts';

export type TimestampType = string | number | Date;

export interface EchartsTimeseriesDatum extends DataRecord {
  __timestamp: TimestampType;
}

export type EchartsBaseTimeseriesSeries = {
  name: string;
  data: [Date, DataRecordValue][];
};

export type EchartsTimeseriesSeries = EchartsBaseTimeseriesSeries & {
  color: string;
  stack?: string;
  type: 'bar' | 'line';
  smooth: boolean;
  step?: 'start' | 'middle' | 'end';
  areaStyle: {
    opacity: number;
  };
  symbolSize: number;
};

export type EchartsTimeseriesProps = {
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
  echartOptions: echarts.EChartOption;
};
