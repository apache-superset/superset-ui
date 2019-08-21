import { ScaleType } from '../types/VegaLite';

export const continuousScaleTypes = new Set([
  'linear',
  'pow',
  'sqrt',
  'symlog',
  'log',
  'time',
  'utc',
]);

export const discreteScaleTypes = new Set(['band', 'point', 'ordinal']);

export const discretizingScaleTypes = new Set(['bin-ordinal', 'quantile', 'quantize', 'threshold']);

export default function getScaleCategoryFromScaleType(scaleType: ScaleType) {
  if (continuousScaleTypes.has(scaleType)) {
    return 'continuous';
  }
  if (discreteScaleTypes.has(scaleType)) {
    return 'discrete';
  }
  if (discretizingScaleTypes.has(scaleType)) {
    return 'discretizing';
  }

  return undefined;
}
