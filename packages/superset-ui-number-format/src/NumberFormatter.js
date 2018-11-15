import isString from 'lodash/isString';
import { format as d3Format } from 'd3-format';
import { ExtensibleFunction, isRequired } from '@superset-ui/core';

export const PREVIEW_VALUE = 12345.432;

export default class NumberFormatter extends ExtensibleFunction {
  constructor(configOrFormatString = isRequired('configOrFormatString')) {
    super((...args) => this.format(...args));

    const config = isString(configOrFormatString)
      ? { formatName: configOrFormatString }
      : configOrFormatString;

    const {
      formatName = isRequired('config.formatName'),
      label,
      description = '',
      formatFunc,
    } = config;

    this.formatName = formatName;
    this.label = label || formatName;
    this.description = description;

    try {
      this.formatFunc = formatFunc || d3Format(formatName);
    } catch (e) {
      this.formatFunc = () => `Invalid format: ${formatName}`;
      this.isInvalid = true;
    }
  }

  format(value) {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return value;
    } else if (value === Number.POSITIVE_INFINITY) {
      return '∞';
    } else if (value === Number.NEGATIVE_INFINITY) {
      return '-∞';
    }

    return this.formatFunc(value);
  }

  preview(value = PREVIEW_VALUE) {
    return `${value} => ${this.format(value)}`;
  }
}
