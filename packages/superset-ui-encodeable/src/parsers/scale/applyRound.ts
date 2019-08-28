import { interpolateRound } from 'd3-interpolate';
import { Value } from '../../types/VegaLite';
import { ScaleConfig, D3Scale } from '../../types/Scale';

export default function applyRound<Output extends Value>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
  if ('round' in config && typeof config.round !== 'undefined') {
    const roundableScale = scale as D3Scale<number>;
    if ('round' in roundableScale) {
      roundableScale.round(config.round);
    } else if ('interpolate' in roundableScale) {
      roundableScale.interpolate(interpolateRound);
    }
  }
}
