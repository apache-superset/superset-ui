import isString from 'lodash/isString';
import { format as d3Format } from 'd3-format';
import { isRequired } from '@superset-ui/core';

export const PREVIEW_VALUE = 12345.432;

export default class NumberFormatter {
  constructor(configOrFormatString = isRequired('configOrFormatString')) {
    const config = isString(configOrFormatString)
      ? { name: configOrFormatString }
      : configOrFormatString;

    const { name = isRequired('config.name'), label, description = '', formatFn } = config;
    this.name = name;
    this.label = label || name;
    this.description = description;
    if (formatFn) {
      this.format = formatFn;
    } else {
      try {
        this.format = d3Format(name);
      } catch (e) {
        this.isInvalid = true;
        this.format = () => `Invalid format: ${name}`;
      }
    }
  }

  preview(value = PREVIEW_VALUE) {
    return `${value} => ${this.format(value)}`;
  }
}
