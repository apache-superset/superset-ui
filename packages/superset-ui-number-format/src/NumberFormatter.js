import isString from 'lodash/isString';
import { format as d3Format } from 'd3-format';
import { isRequired } from '@superset-ui/core';

export const PREVIEW_VALUE = 12345.432;

/**
 * From https://stackoverflow.com/questions/36871299/how-to-extend-function-with-es6-classes
 */
class ExtensibleFunction extends Function {
  constructor(fn) {
    return Object.setPrototypeOf(fn, new.target.prototype);
  }
}

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
      this.format = formatFunc || d3Format(formatName);
    } catch (e) {
      this.format = () => `Invalid format: ${formatName}`;
      this.isInvalid = true;
    }
  }

  preview(value = PREVIEW_VALUE) {
    return `${value} => ${this.format(value)}`;
  }
}
