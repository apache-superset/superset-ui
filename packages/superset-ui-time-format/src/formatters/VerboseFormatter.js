/* eslint-disable sort-keys */

import { timeFormat as d3TimeFormat } from 'd3-time-format';
import TimeFormatter from '../TimeFormatter';

const siFormatter = d3TimeFormat('.3s');

const formatter = new TimeFormatter({
  name: 'verbose',
  label: 'Verbose formatter',
  formatFn(n) {
    let si = siFormatter(n);
    // Removing trailing `.00` if any
    if (si.slice(-1) < 'A') {
      si = parseFloat(si).toString();
    }

    return si;
  },
});

export default formatter;
