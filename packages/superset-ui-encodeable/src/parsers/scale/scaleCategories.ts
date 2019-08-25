import { ScaleType } from '../../types/VegaLite';

// Grouped by domain and range

export const continuousToContinuousScaleTypes: ScaleType[] = [
  ScaleType.LINEAR,
  ScaleType.POW,
  ScaleType.SQRT,
  ScaleType.SYMLOG,
  ScaleType.LOG,
  ScaleType.TIME,
  ScaleType.UTC,
];
export const continuousToContinuousScaleTypesSet = new Set(continuousToContinuousScaleTypes);

export const continuousToDiscreteScaleTypes: ScaleType[] = [
  ScaleType.QUANTILE,
  ScaleType.QUANTIZE,
  ScaleType.THRESHOLD,
];
export const continuousToDiscreteScaleTypesSet = new Set(continuousToDiscreteScaleTypes);

// Grouped by Domain

export const continuousDomainScaleTypes: ScaleType[] = continuousToContinuousScaleTypes.concat(
  continuousToDiscreteScaleTypes,
);
export const continuousDomainScaleTypesSet = new Set(continuousDomainScaleTypes);

export const discreteDomainScaleTypes: ScaleType[] = [
  ScaleType.ORDINAL,
  ScaleType.BIN_ORDINAL,
  ScaleType.POINT,
  ScaleType.BAND,
];
export const discreteDomainScaleTypesSet = new Set(discreteDomainScaleTypes);

// Three broad categories

export const continuousScaleTypes: ScaleType[] = continuousToContinuousScaleTypes;
export const continuousScaleTypesSet = continuousToContinuousScaleTypesSet;

export const discreteScaleTypes: ScaleType[] = ['band', 'point', 'ordinal'];
export const discreteScaleTypesSet = new Set(discreteScaleTypes);

export const discretizingScaleTypes: ScaleType[] = [
  ScaleType.BIN_ORDINAL,
  ScaleType.QUANTILE,
  ScaleType.QUANTIZE,
  ScaleType.THRESHOLD,
];
export const discretizingScaleTypesSet = new Set(discretizingScaleTypes);

// Others

export const timeScaleTypes: ScaleType[] = [ScaleType.TIME, ScaleType.UTC];
export const timeScaleTypesSet = new Set(timeScaleTypes);

export const allScaleTypes = [];
export const allScaleTypesSet = new Set(allScaleTypes);
