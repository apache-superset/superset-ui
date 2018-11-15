import { ExtensibleFunction, isRequired } from '@superset-ui/core';

// eslint-disable-next-line
export const PREVIEW_TIME = new Date(Date.UTC(2017, 1, 14, 11, 22, 33));

export default class TimeFormatter extends ExtensibleFunction {
  constructor({
    id = isRequired('config.id'),
    label,
    description = '',
    formatFunc = isRequired('config.formatFunc'),
  } = {}) {
    super((...args) => this.format(...args));

    this.id = id;
    this.label = label || id;
    this.description = description;
    this.formatFunc = formatFunc;
  }

  format(value) {
    return this.formatFunc(value);
  }

  preview(value = PREVIEW_TIME) {
    return `${value.toUTCString()} => ${this.format(value)}`;
  }
}
