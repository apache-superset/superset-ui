import { ScaleType } from '../../types/VegaLite';
import { CombinedScaleConfig } from '../../types/Scale';
import {
  allScaleTypesSet,
  allScaleTypes,
  continuousDomainScaleTypes,
  continuousScaleTypes,
  continuousScaleTypesSet,
} from './scaleCategories';

const pointOrBand: ScaleType[] = ['point', 'band'];
const pointOrBandSet = new Set(pointOrBand);
const exceptPointOrBand = allScaleTypes.filter(type => !pointOrBandSet.has(type));
const exceptPointOrBandSet = new Set(exceptPointOrBand);
const continuousOrPointOrBandSet = new Set(continuousScaleTypes.concat(pointOrBand));

const zeroSet = new Set(continuousDomainScaleTypes);
// log scale cannot have zero value
zeroSet.delete('log');
// zero is not meaningful for time
zeroSet.delete('time');
zeroSet.delete('utc');
// threshold requires custom domain so zero does not matter
zeroSet.delete('threshold');
// quantile depends on distribution so zero does not matter
zeroSet.delete('quantile');

const supportedScaleTypes: Record<keyof CombinedScaleConfig, Set<ScaleType>> = {
  align: pointOrBandSet,
  base: new Set(['log']),
  bins: new Set(exceptPointOrBand.filter(type => type !== 'ordinal')),
  clamp: continuousScaleTypesSet,
  constant: new Set(['symlog']),
  domain: allScaleTypesSet,
  exponent: new Set(['pow']),
  interpolate: exceptPointOrBandSet,
  namespace: new Set(['ordinal']),
  nice: new Set(continuousScaleTypes.concat(['quantize', 'threshold'])),
  padding: continuousOrPointOrBandSet,
  paddingInner: new Set(['band']),
  paddingOuter: pointOrBandSet,
  range: allScaleTypesSet,
  reverse: allScaleTypesSet,
  round: continuousOrPointOrBandSet,
  scheme: exceptPointOrBandSet,
  zero: zeroSet,
};

export default function isPropertySupportedByScaleType(
  property: keyof CombinedScaleConfig,
  scaleType: ScaleType,
) {
  return supportedScaleTypes[property].has(scaleType);
}
