import { DataRecord } from '@superset-ui/chart';

export type TimestampType = string | number | Date;

export interface EchartsTimeseriesRawDatum extends DataRecord {
  __timestamp: TimestampType;
}

export interface EchartsTimeseriesDatum extends DataRecord {
  __timestamp: Date;
}
