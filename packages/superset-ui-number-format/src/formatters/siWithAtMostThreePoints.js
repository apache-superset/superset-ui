/* eslint-disable sort-keys */

import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';

const siFormatter = d3Format('.3s');

const formatter = new NumberFormatter({
  name: 'si_with_at_most_three_points',
  label: 'SI with <=3 decimal points',
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
