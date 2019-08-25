import { ScaleType } from '../../types/VegaLite';
import {
  continuousScaleTypesSet,
  discreteScaleTypesSet,
  discretizingScaleTypesSet,
} from './scaleCategories';

export default function getScaleCategoryFromScaleType(scaleType: ScaleType) {
  if (continuousScaleTypesSet.has(scaleType)) {
    return 'continuous';
  }
  if (discreteScaleTypesSet.has(scaleType)) {
    return 'discrete';
  }
  if (discretizingScaleTypesSet.has(scaleType)) {
    return 'discretizing';
  }

  return undefined;
}
