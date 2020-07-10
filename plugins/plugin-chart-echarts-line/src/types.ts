import { DataRecord } from '@superset-ui/chart';

export type TimestampType = string | number | Date;

export interface EchartsLineRawDatum extends DataRecord {
  __timestamp: TimestampType;
}

export interface EchartsLineDatum extends DataRecord {
  __timestamp: Date;
}
