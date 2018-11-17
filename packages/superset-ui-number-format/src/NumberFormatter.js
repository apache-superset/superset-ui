import { ExtensibleFunction, isRequired } from '@superset-ui/core';

export const PREVIEW_VALUE = 12345.432;

export default class NumberFormatter extends ExtensibleFunction {
  constructor({
    formatId = isRequired('config.formatId'),
    label,
    description = '',
    formatFunc = isRequired('config.formatFunc'),
  } = {}) {
    super((...args) => this.format(...args));

    this.formatId = formatId;
    this.label = label || formatId;
    this.description = description;
    this.formatFunc = formatFunc;
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
