import { makeSingleton } from '@superset-ui/core';
import TimeFormatterRegistry from './TimeFormatterRegistry';
import { TimeGranularity } from './types';
import createTimeRangeFromGranularity from './utils/createTimeRangeFromGranularity';
import { LOCAL_PREFIX } from './TimeFormats';
import TimeFormatsForGranularity from './TimeFormatsForGranularity';

const getInstance = makeSingleton(TimeFormatterRegistry);

export default getInstance;

export function formatTimeRange(formatId: string | undefined, range: (Date | null | undefined)[]) {
  const format = getInstance().get(formatId);
  const [start, end] = range.map(value => format(value));
  return start === end ? start : `${start}—${end}`;
}

export function formatTime(
  formatId: string | undefined,
  value: Date | null | undefined,
  granularity?: TimeGranularity,
) {
  if (granularity && value != null) {
    return formatTimeRange(
      formatId || TimeFormatsForGranularity[granularity],
      createTimeRangeFromGranularity(value, granularity, formatId?.startsWith(LOCAL_PREFIX)),
    );
  }
  return getInstance().format(formatId, value);
}

export function getTimeFormatter(formatId?: string, granularity?: TimeGranularity) {
  if (granularity) {
    return (value: Date | null | undefined) => formatTime(formatId, value, granularity);
  }

  return getInstance().get(formatId);
}
