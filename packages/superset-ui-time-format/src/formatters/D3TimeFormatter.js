import isString from 'lodash/isString';
import { utcFormat, timeFormat } from 'd3-time-format';
import { isRequired } from '@superset-ui/core';
import TimeFormatter from '../TimeFormatter';

export default class D3TimeFormatter extends TimeFormatter {
  /**
   * Pass only the D3 format string to constructor
   *
   * new D3TimeFormatter('%d/%m/%Y');
   *
   * or accompany it with human-readable label and description
   *
   * new D3TimeFormatter({
   *   id: '%d/%m/%Y',
   *   label: 'US Date Format (UTC time)',
   *   description: 'lorem ipsum dolor sit amet',
   * });
   *
   * new D3TimeFormatter({
   *   id: 'local!%d/%m/%Y',
   *   label: 'US Date Format (Local time)',
   *   description: 'lorem ipsum dolor sit amet',
   * });
   *
   * @param {String|Object} configOrFormatString
   */
  constructor(configOrFormatString = isRequired('configOrFormatString')) {
    const config = isString(configOrFormatString)
      ? { id: configOrFormatString }
      : configOrFormatString;

    const { description, id, label } = config;
    const useLocalTime = id.startsWith('local!');
    const formatString = id.replace(/^(local)[!]/, '');
    const formatFunc = useLocalTime ? timeFormat(formatString) : utcFormat(formatString);

    super({ description, formatFunc, id, label });
    this.useLocalTime = useLocalTime;
  }
}
