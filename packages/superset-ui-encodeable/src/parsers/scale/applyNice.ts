import { Value } from '../../types/VegaLite';
import { ScaleConfig, D3Scale } from '../../types/Scale';

export default function applyNice<Output extends Value>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
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
