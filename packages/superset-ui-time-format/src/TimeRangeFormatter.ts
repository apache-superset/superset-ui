import { ExtensibleFunction } from '@superset-ui/core';
import { TimeFormatFunction } from './types';
import { PREVIEW_TIME } from './TimeFormatter';

export const PREVIEW_TIME2 = new Date(Date.UTC(2017, 1, 20, 14, 25, 36));

// Use type augmentation to indicate that
// an instance of TimeFormatter is also a function
interface TimeRangeFormatter {
  (value: (Date | number | null | undefined)[]): string;
}

class TimeRangeFormatter extends ExtensibleFunction {
  id: string;

  label: string;

  description: string;

  formatFunc: TimeFormatFunction;

  useLocalTime: boolean;

  constructor(config: {
    id: string;
    label?: string;
    description?: string;
    formatFunc: TimeFormatFunction;
    useLocalTime?: boolean;
  }) {
    super((value: (Date | number | null | undefined)[]) => this.format(value));

    const { id, label, description = '', formatFunc, useLocalTime = false } = config;

    this.id = id;
    this.label = label ?? id;
    this.description = description;
    this.formatFunc = formatFunc;
    this.useLocalTime = useLocalTime;
  }

  format(value: (Date | number | null | undefined)[]) {
    if (value === null || value === undefined) {
      return `${value}`;
    }

    return this.formatFunc(value instanceof Date ? value : new Date(value));
  }

  preview(values: Date[] = [PREVIEW_TIME, PREVIEW_TIME2]) {
    return `[${values.map(v => v.toUTCString()).join(',')}] => ${this.format(values)}`;
  }
}

export default TimeRangeFormatter;
