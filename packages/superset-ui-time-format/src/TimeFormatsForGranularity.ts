import TimeFormats from './TimeFormats';
import { TimeGranularity } from './types';

const MINUTE = '%Y-%m-%d %H:%M';
const SUNDAY_BASED_WEEK = '%Y-%m-%d W%U';
const MONDAY_BASED_WEEK = '%Y-%m-%d W%W';
const { DATABASE_DATE, DATABASE_DATETIME } = TimeFormats;

/**
 * Map time granularity to d3-format string
 */
const TimeFormatsForGranularity: Record<TimeGranularity, string> = {
  [TimeGranularity.DATE]: DATABASE_DATE,
  [TimeGranularity.SECOND]: DATABASE_DATETIME,
  [TimeGranularity.MINUTE]: MINUTE,
  [TimeGranularity.FIVE_MINUTES]: MINUTE,
  [TimeGranularity.TEN_MINUTES]: MINUTE,
  [TimeGranularity.FIFTEEN_MINUTES]: MINUTE,
  [TimeGranularity.HALF_HOUR]: MINUTE,
  [TimeGranularity.HOUR]: '%Y-%m-%d %H:00',
  [TimeGranularity.DAY]: DATABASE_DATE,
  [TimeGranularity.WEEK]: SUNDAY_BASED_WEEK,
  [TimeGranularity.MONTH]: '%Y-%m',
  [TimeGranularity.QUARTER]: '%Y Q%q',
  [TimeGranularity.YEAR]: '%Y',
  [TimeGranularity.WEEK_STARTING_SUNDAY]: SUNDAY_BASED_WEEK,
  [TimeGranularity.WEEK_STARTING_MONDAY]: MONDAY_BASED_WEEK,
  [TimeGranularity.WEEK_ENDING_SATURDAY]: SUNDAY_BASED_WEEK,
  [TimeGranularity.WEEK_ENDING_SUNDAY]: MONDAY_BASED_WEEK,
};

export default TimeFormatsForGranularity;
