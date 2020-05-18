import { makeSingleton } from '@superset-ui/core';
import TimeFormatterRegistry from './TimeFormatterRegistry';
import TimeFormatter from './TimeFormatter';
import TimeFormatsForGranularity from './TimeFormatsForGranularity';
import { LOCAL_PREFIX } from './TimeFormats';
import { TimeGranularity } from './types';
import createTimeRangeFromGranularity from './utils/createTimeRangeFromGranularity';

const getInstance = makeSingleton(TimeFormatterRegistry);

export default getInstance;

export function getTimeRangeFormatter(formatId?: string) {
  return (range: (Date | null | undefined)[]) => {
    const format = getInstance().get(formatId);
    const [start, end] = range.map(value => format(value));
    return start === end ? start : [start, end].join(' — ');
  };
}

export function formatTimeRange(formatId: string | undefined, range: (Date | null | undefined)[]) {
  return getTimeRangeFormatter(formatId)(range);
}

export function getTimeFormatter(formatId?: string, granularity?: TimeGranularity) {
  if (granularity) {
    const useLocalTime = formatId?.startsWith(LOCAL_PREFIX);

    return new TimeFormatter({
      id: [formatId, granularity].join('/'),
      formatFunc: (value: Date) =>
        formatTimeRange(
          formatId || TimeFormatsForGranularity[granularity],
          createTimeRangeFromGranularity(value, granularity, useLocalTime),
        ),
      useLocalTime,
    });
  }

  return getInstance().get(formatId);
}

export function formatTime(
  formatId: string | undefined,
  value: Date | null | undefined,
  granularity?: TimeGranularity,
) {
  return getTimeFormatter(formatId, granularity)(value);
}
