import { TimeGranularity } from '../types';
import createDate from './createDate';

const MS_IN_SECOND = 1000;
const MS_IN_MINUTE = 60 * MS_IN_SECOND;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;
const MS_IN_DAY = 24 * MS_IN_HOUR;
const MS_IN_WEEK = 7 * MS_IN_DAY;

const Offsets: Record<
  Exclude<
    TimeGranularity,
    typeof TimeGranularity.MONTH | typeof TimeGranularity.QUARTER | typeof TimeGranularity.YEAR
  >,
  number
> = {
  [TimeGranularity.DATE]: MS_IN_DAY - 1,
  [TimeGranularity.SECOND]: MS_IN_SECOND - 1,
  [TimeGranularity.MINUTE]: MS_IN_MINUTE - 1,
  [TimeGranularity.FIVE_MINUTES]: MS_IN_MINUTE * 5 - 1,
  [TimeGranularity.TEN_MINUTES]: MS_IN_MINUTE * 10 - 1,
  [TimeGranularity.FIFTEEN_MINUTES]: MS_IN_MINUTE * 15 - 1,
  [TimeGranularity.HALF_HOUR]: MS_IN_MINUTE * 30 - 1,
  [TimeGranularity.HOUR]: MS_IN_HOUR - 1,
  [TimeGranularity.DAY]: MS_IN_DAY - 1,
  [TimeGranularity.WEEK]: MS_IN_WEEK - 1,
  [TimeGranularity.WEEK_STARTING_SUNDAY]: MS_IN_WEEK - 1,
  [TimeGranularity.WEEK_STARTING_MONDAY]: MS_IN_WEEK - 1,
  [TimeGranularity.WEEK_ENDING_SATURDAY]: -MS_IN_WEEK + 1,
  [TimeGranularity.WEEK_ENDING_SUNDAY]: -MS_IN_WEEK + 1,
};

function deductOneMs(time: Date) {
  return new Date(time.getTime() - 1);
}

function computeEndTimeFromGranularity(
  time: Date,
  granularity:
    | typeof TimeGranularity.MONTH
    | typeof TimeGranularity.QUARTER
    | typeof TimeGranularity.YEAR,
  useLocalTime: boolean,
) {
  const month = useLocalTime ? time.getMonth() : time.getUTCMonth();
  const year = useLocalTime ? time.getFullYear() : time.getUTCFullYear();
  if (granularity === TimeGranularity.MONTH) {
    return deductOneMs(
      createDate(
        month === 11 ? { year: year + 1, useLocalTime } : { year, month: month + 1, useLocalTime },
      ),
    );
  }
  if (granularity === TimeGranularity.QUARTER) {
    const quarter = Math.floor(month / 3) + 1;
    return deductOneMs(
      createDate(
        quarter <= 3
          ? { year, month: quarter * 3, useLocalTime }
          : { year: year + 1, useLocalTime },
      ),
    );
  }

  // Year
  return deductOneMs(createDate({ year: year + 1, useLocalTime }));
}

export default function createTimeRangeFromGranularity(
  time: Date,
  granularity: TimeGranularity,
  useLocalTime: boolean = false,
) {
  if (
    granularity === TimeGranularity.MONTH ||
    granularity === TimeGranularity.QUARTER ||
    granularity === TimeGranularity.YEAR
  ) {
    return [time, computeEndTimeFromGranularity(time, granularity, useLocalTime)];
  }
  const offset = Offsets[granularity];

  if (offset >= 0) {
    const offsetTime = new Date(time.getTime() + offset);
    return [time, offsetTime];
  }

  // For the WEEK_ENDING_XXX cases,
  // currently assume given time is at 00:00:00.000 from database
  // so add 23:59:59.999
  const endTime = new Date(time.getTime() + MS_IN_DAY - 1);
  const offsetTime = new Date(endTime.getTime() + offset);
  return [offsetTime, endTime];
}
