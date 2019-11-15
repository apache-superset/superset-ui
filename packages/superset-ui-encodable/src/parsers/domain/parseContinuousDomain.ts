import { ChannelInput } from '../../types/Channel';
import { ScaleType } from '../../types/VegaLite';
import { timeScaleTypesSet } from '../scale/scaleCategories';

/**
 * Convert each element in the array into
 * - Date (for time scales)
 * - number (for other continuous scales)
 * @param domain
 * @param scaleType
 */
export default function parseContinuousDomain<T extends ChannelInput>(
  domain: T[],
  scaleType: ScaleType,
) {
  if (timeScaleTypesSet.has(scaleType)) {
    type TimeDomain = Exclude<T, string | number | boolean | undefined | null>[];

    return domain
      .filter(d => typeof d !== 'undefined' && d !== null && typeof d !== 'boolean')
      .map(d => (typeof d === 'string' || typeof d === 'number' ? new Date(d) : d)) as TimeDomain;
  }

  type NumberDomain = Exclude<T, string | boolean | undefined | null>[];

  return domain
    .filter(d => typeof d !== 'undefined' && d !== null)
    .map(d => (typeof d === 'string' || typeof d === 'boolean' ? Number(d) : d)) as NumberDomain;
}
