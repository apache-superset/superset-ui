import { isEveryElementDefined, isDefined } from '../typeGuards/Base';

/**
 * Combine two continuous domain and ensure that the output
 * does not go beyond fixedDomain
 * @param fixedDomain
 * @param inputDomain
 */
export default function combineContinuousDomains(
  fixedDomain: (number | Date | null | undefined)[],
  inputDomain?: (number | Date)[],
) {
  if (isEveryElementDefined(fixedDomain)) {
    return fixedDomain;
  } else if (inputDomain) {
    if (
      fixedDomain.length === 2 &&
      inputDomain.length === 2 &&
      fixedDomain.filter(isDefined).length > 0
    ) {
      const [min1, max1] = fixedDomain;
      const [min2, max2] = inputDomain;
      let min = min2;
      if (isDefined(min1)) {
        min = min1.valueOf() > min2.valueOf() ? min1 : min2;
      }
      let max = max2;
      if (isDefined(max1)) {
        max = max1.valueOf() < max2.valueOf() ? max1 : max2;
      }

      return [min, max];
    }

    return inputDomain;
  }

  return undefined;
}
