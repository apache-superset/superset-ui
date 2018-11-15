/* eslint-disable sort-keys */

import { format as d3Format } from 'd3-format';
import NumberFormatter from '../NumberFormatter';

export default class SiAtMostNDigitFormatter extends NumberFormatter {
  constructor(n = 3) {
    const siFormatter = d3Format(`.${n}s`);

    super({
      formatName: `si_at_most_${n}_digit`,
      label: `SI with at most ${n} significant digits`,
      formatFunc: value => {
        const si = siFormatter(value);

        // Removing trailing `.00` if any
        return si.slice(-1) < 'A' ? parseFloat(si).toString() : si;
      },
    });
  }
}
