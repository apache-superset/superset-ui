import { Value } from '../../types/VegaLite';
import { ScaleConfig, D3Scale } from '../../types/Scale';

export default function applyZero<Output extends Value>(
  config: ScaleConfig<Output>,
  scale: D3Scale<Output>,
) {
  if ('zero' in config && typeof config.zero !== 'undefined') {
    const [min, max] = scale.domain();
    if (typeof min === 'number' && typeof max === 'number') {
      scale.domain([Math.min(0, min), Math.max(0, max)]);
    }
  }
}
