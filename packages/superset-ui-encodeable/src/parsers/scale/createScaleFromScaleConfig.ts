import {
  scaleLinear,
  scaleLog,
  scalePow,
  scaleSqrt,
  scaleTime,
  scaleUtc,
  scaleQuantile,
  scaleQuantize,
  scaleThreshold,
  scaleOrdinal,
  scalePoint,
  scaleBand,
} from 'd3-scale';
import { getSequentialSchemeRegistry, CategoricalColorNamespace } from '@superset-ui/color';
import { ScaleType, Value } from '../../types/VegaLite';
import { HasToString } from '../../types/Base';
import { ScaleConfig, D3Scale } from '../../types/Scale';

function applySequentialScheme<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale) {
  if ('scheme' in config && typeof config.scheme !== 'undefined') {
    const { scheme } = config;
    const colorScheme = getSequentialSchemeRegistry().get(scheme);
    if (typeof colorScheme !== 'undefined') {
      scale.range(colorScheme.colors);
    }
  }
}

function applyAlign<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
  if ('align' in config && typeof config.align !== 'undefined' && 'align' in scale) {
    scale.align(config.align);
  }
}

function applyBins<Output extends Value>(config: ScaleConfig<Output>, scale: D3Scale<Output>) {
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
    throw new Error('"scale.interpolate" is not implemented yet.');
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
    } else if ('interval' in nice) {
      // TODO: Convert interval object to d3 time interval
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
  if ('round' in config && typeof config.round !== 'undefined' && 'round' in scale) {
    scale.round(config.round);
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

// eslint-disable-next-line complexity
function createScaleFromScaleType<Output extends Value>(config: ScaleConfig<Output>) {
  switch (config.type) {
    default:
    case ScaleType.LINEAR:
      return scaleLinear<Output>();
    case ScaleType.LOG:
      return typeof config.base === 'undefined'
        ? scaleLog<Output>()
        : scaleLog<Output>().base(config.base);
    case ScaleType.POW:
      return typeof config.exponent === 'undefined'
        ? scalePow<Output>()
        : scalePow<Output>().exponent(config.exponent);
    case ScaleType.SQRT:
      return scaleSqrt<Output>();
    case ScaleType.SYMLOG:
      // TODO: d3-scale typings does not include scaleSymlog yet
      // needs to patch the declaration file before continue.
      throw new Error('"scale.type = symlog" is not implemented yet.');
    case ScaleType.TIME:
      return scaleTime<Output>();
    case ScaleType.UTC:
      return scaleUtc<Output>();
    case ScaleType.QUANTILE:
      return scaleQuantile<Output>();
    case ScaleType.QUANTIZE:
      return scaleQuantize<Output>();
    case ScaleType.THRESHOLD:
      return scaleThreshold<number | string | Date, Output>();
    case ScaleType.BIN_ORDINAL:
    case ScaleType.ORDINAL:
      return scaleOrdinal<HasToString, Output>();
    case ScaleType.POINT:
      return scalePoint<HasToString>();
    case ScaleType.BAND:
      return scaleBand<HasToString>();
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

    return colorScale;
  }

  const scale = createScaleFromScaleType(config);

  if (typeof domain !== 'undefined') {
    scale.domain(reverse ? domain.slice().reverse() : domain);
  }

  if (typeof range === 'undefined') {
    applySequentialScheme(config, scale);
  } else {
    scale.range(range);
  }

  applyAlign(config, scale);
  applyBins(config, scale);
  applyClamp(config, scale);

  // TODO: Add support for config.constant
  // once symlog is implemented

  applyInterpolate(config, scale);
  applyNice(config, scale);
  applyPadding(config, scale);
  applyRound(config, scale);
  applyZero(config, scale);

  return scale;
}
