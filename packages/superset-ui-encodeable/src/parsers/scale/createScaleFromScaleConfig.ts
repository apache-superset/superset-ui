import { interpolateRound } from 'd3-interpolate';
import { getSequentialSchemeRegistry, CategoricalColorNamespace } from '@superset-ui/color';
import { ScaleType, Value } from '../../types/VegaLite';
import { ScaleConfig, D3Scale, TimeScaleConfig } from '../../types/Scale';
import createScaleFromScaleType from './createScaleFromScaleType';
import parseDateTime from '../parseDateTime';
import inferElementTypeFromUnionOfArrayTypes from '../../utils/inferElementTypeFromUnionOfArrayTypes';
import { isTimeScale } from '../../typeGuards/Scale';

function applyDomain<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  const { domain, reverse, type } = config;
  if (typeof domain !== 'undefined') {
    const processedDomain = reverse ? domain.slice().reverse() : domain;
    if (isTimeScale(scale, type)) {
      const timeDomain = processedDomain as TimeScaleConfig['domain'];
      scale.domain(inferElementTypeFromUnionOfArrayTypes(timeDomain).map(d => parseDateTime(d)));
    } else {
      scale.domain(processedDomain);
    }
  }
}

function applyRange<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  const { range } = config;
  if (typeof range === 'undefined') {
    if ('scheme' in config && typeof config.scheme !== 'undefined') {
      const { scheme } = config;
      const colorScheme = getSequentialSchemeRegistry().get(scheme);
      if (typeof colorScheme !== 'undefined') {
        scale.range(colorScheme.colors as Output[]);
      }
    }
  } else {
    scale.range(range);
  }
}

function applyAlign<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('align' in config && typeof config.align !== 'undefined' && 'align' in scale) {
    scale.align(config.align);
  }
}

function applyBins<Output extends Value>(config: ScaleConfig<Output>) {
  if ('bins' in config && typeof config.bins !== 'undefined') {
    throw new Error('"scale.bins" is not implemented yet.');
  }
}

function applyClamp<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('clamp' in config && typeof config.clamp !== 'undefined' && 'clamp' in scale) {
    scale.clamp(config.clamp);
  }
}

function applyInterpolate<Output extends Value>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
  if (
    'interpolate' in config &&
    typeof config.interpolate !== 'undefined' &&
    'interpolate' in scale
  ) {
    // TODO: Need to convert interpolate string into interpolate function
    throw new Error('"scale.interpolate" is not supported yet.');
  }
}

function applyNice<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('nice' in config && typeof config.nice !== 'undefined' && 'nice' in scale) {
    const { nice } = config;
    if (typeof nice === 'boolean') {
      if (nice === true) {
        scale.nice();
      }
    } else if (typeof nice === 'number') {
      scale.nice(nice);
    } else if (typeof nice === 'string') {
      // TODO: Convert string to d3 time interval
      throw new Error('"scale.nice" as string is not supported yet.');
    } else if ('interval' in nice) {
      // TODO: Convert interval object to d3 time interval
      throw new Error('"scale.nice" as interval object is not supported yet.');
    }
  }
}

function applyPadding<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('padding' in config && typeof config.padding !== 'undefined' && 'padding' in scale) {
    scale.padding(config.padding);
  }

  if (
    'paddingInner' in config &&
    typeof config.paddingInner !== 'undefined' &&
    'paddingInner' in scale
  ) {
    scale.paddingInner(config.paddingInner);
  }

  if (
    'paddingOuter' in config &&
    typeof config.paddingOuter !== 'undefined' &&
    'paddingOuter' in scale
  ) {
    scale.paddingOuter(config.paddingOuter);
  }
}

function applyRound<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('round' in config && typeof config.round !== 'undefined') {
    const roundableScale = scale as D3Scale<number>;
    if ('round' in roundableScale) {
      roundableScale.round(config.round);
    } else if ('interpolate' in roundableScale) {
      roundableScale.interpolate(interpolateRound);
    }
  }
}

function applyZero<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('zero' in config && typeof config.zero !== 'undefined') {
    const [min, max] = scale.domain();
    if (typeof min === 'number' && typeof max === 'number') {
      scale.domain([Math.min(0, min), Math.max(0, max)]);
    }
  }
}

export default function createScaleFromScaleConfig<Output extends Value>(
  config: ScaleConfig<Output>,
) {
  const { domain, range, reverse } = config;

  // Handle categorical color scales
  // An ordinal scale without specified range
  // is assumed to be a color scale.
  if (config.type === ScaleType.ORDINAL && typeof range === 'undefined') {
    const scheme = 'scheme' in config ? config.scheme : undefined;
    const namespace = 'namespace' in config ? config.namespace : undefined;
    const colorScale = CategoricalColorNamespace.getScale(scheme, namespace);

    // If domain is also provided,
    // ensure the nth item is assigned the nth color
    if (typeof domain !== 'undefined') {
      const { colors } = colorScale;
      (reverse ? domain.slice().reverse() : domain).forEach((value: any, index: number) => {
        colorScale.setColor(`${value}`, colors[index % colors.length]);
      });
    }

    // Need to manually cast here to make the unioned output types
    // considered function.
    // Otherwise have to add type guards before using the scale function.
    //
    //   const scaleFn = createScaleFromScaleConfig(...)
    //   if (isAFunction(scaleFn)) const encodedValue = scaleFn(10)
    //
    // CategoricalColorScale is actually a function,
    // but TypeScript is not smart enough to realize that by itself.
    return (colorScale as unknown) as (val?: any) => string;
  }

  const scale = createScaleFromScaleType(config);
  // domain and range apply to all scales
  applyDomain(config, scale);
  applyRange(config, scale);
  // Sort other properties alphabetically.
  applyAlign(config, scale);
  applyBins(config);
  applyClamp(config, scale);
  applyInterpolate(config, scale);
  applyNice(config, scale);
  applyPadding(config, scale);
  applyRound(config, scale);
  applyZero(config, scale);

  return scale;
}
