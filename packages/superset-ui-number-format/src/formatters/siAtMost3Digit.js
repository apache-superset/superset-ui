/* eslint-disable sort-keys */

import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';

const siFormatter = d3Format('.3s');

const formatter = new NumberFormatter({
  formatName: 'si_at_most_3_digit',
  label: 'SI with at most 3 significant digits',
  formatFunc(n) {
    const si = siFormatter(n);

    // Removing trailing `.00` if any
    return si.slice(-1) < 'A' ? parseFloat(si).toString() : si;
  },
});

export default formatter;
