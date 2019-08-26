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
import isPropertySupportedByScaleType from './isPropertySupportedByScaleType';

// eslint-disable-next-line complexity
export default function createScaleFromScaleConfig<Output extends Value = Value>(
  config: ScaleConfig<Output>,
) {
  let scale: D3Scale | undefined;

  if (config.type === ScaleType.LINEAR) {
    scale = scaleLinear<Output>();
  } else if (config.type === ScaleType.LOG) {
    const { base } = config;
    const logScale = scaleLog<Output>();
    if (typeof base !== 'undefined') {
      logScale.base(base);
    }
    scale = logScale;
  } else if (config.type === ScaleType.POW) {
    const { exponent } = config;
    const powScale = scalePow<Output>();
    if (typeof exponent !== 'undefined') {
      powScale.exponent(exponent);
    }
    scale = powScale;
  } else if (config.type === ScaleType.SQRT) {
    scale = scaleSqrt<Output>();
  } else if (config.type === ScaleType.SYMLOG) {
    // TODO: d3-scale typings does not include scaleSymlog yet
    // needs to patch the declaration file before continue.
    throw new Error('"scale.type = symlog" is not implemented yet.');
  } else if (config.type === ScaleType.TIME) {
    scale = scaleTime<Output>();
  } else if (config.type === ScaleType.UTC) {
    scale = scaleUtc<Output>();
  } else if (config.type === ScaleType.QUANTILE) {
    scale = scaleQuantile<Output>();
  } else if (config.type === ScaleType.QUANTIZE) {
    scale = scaleQuantize<Output>();
  } else if (config.type === ScaleType.THRESHOLD) {
    scale = scaleThreshold<number | string | Date, Output>();
  } else if (config.type === ScaleType.BIN_ORDINAL) {
    scale = scaleOrdinal<HasToString, Output>();
  } else if (config.type === ScaleType.ORDINAL) {
    const { domain, range, reverse } = config;

    // Handle categorical color scales
    // An ordinal scale without specified range
    // is assumed to be a color scale.
    if (typeof range === 'undefined') {
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

    scale = scaleOrdinal<HasToString, Output>();
  } else if (config.type === ScaleType.POINT) {
    scale = scalePoint<HasToString>();
  } else if (config.type === ScaleType.BAND) {
    scale = scaleBand<HasToString>();
  }

  if (typeof scale !== 'undefined') {
    const { domain, range, reverse } = config;

    if (typeof domain !== 'undefined') {
      scale.domain(reverse ? domain.slice().reverse() : domain);
    }

    if (typeof range !== 'undefined') {
      scale.range(range);
    } else if ('scheme' in config && typeof config.scheme !== 'undefined') {
      const { scheme } = config;
      const colorScheme = getSequentialSchemeRegistry().get(scheme);
      if (typeof colorScheme !== 'undefined') {
        scale.range(colorScheme.colors);
      }
    }

    if ('align' in config && typeof config.align !== 'undefined' && 'align' in scale) {
      scale.align(config.align);
    }

    if (
      'bins' in config &&
      typeof config.bins !== 'undefined' &&
      isPropertySupportedByScaleType('bins', config.type)
    ) {
      throw new Error('"scale.bins" is not implemented yet.');
    }

    if ('clamp' in config && typeof config.clamp !== 'undefined' && 'clamp' in scale) {
      scale.clamp(config.clamp);
    }

    // TODO: Add support for config.constant
    // once symlog is implemented

    if (
      'interpolate' in config &&
      typeof config.interpolate !== 'undefined' &&
      'interpolate' in scale
    ) {
      // TODO: Need to convert interpolate string into interpolate function
      throw new Error('"scale.interpolate" is not implemented yet.');
    }

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

    if ('round' in config && typeof config.round !== 'undefined' && 'round' in scale) {
      scale.round(config.round);
    }

    if ('zero' in config && typeof config.zero !== 'undefined') {
      const [min, max] = scale.domain();
      if (typeof min === 'number' && typeof max === 'number') {
        scale.domain([Math.min(0, min), Math.max(0, max)]);
      }
    }
  }

  return scale;
}
