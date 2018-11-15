/* eslint-disable sort-keys */

import isString from 'lodash/isString';
import { format as d3Format } from 'd3-format';
import { isRequired } from '@superset-ui/core';
import NumberFormatter from '../NumberFormatter';

export default class D3Formatter extends NumberFormatter {
  constructor(configOrFormatString = isRequired('configOrFormatString')) {
    const config = isString(configOrFormatString)
      ? { formatName: configOrFormatString }
      : configOrFormatString;

    let formatFunc;
    let isInvalid = false;

    try {
      formatFunc = d3Format(config.formatName);
    } catch (e) {
      formatFunc = () => `Invalid format: ${config.formatName}`;
      isInvalid = true;
    }

    super({ ...config, formatFunc });
    this.isInvalid = isInvalid;
  }
}
