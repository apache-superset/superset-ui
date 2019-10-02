import { ChannelDef } from '../types/ChannelDef';
import { Value } from '../types/VegaLite';
import { Legend } from '../types/Legend';

export type CompleteLegendConfig = false | Legend;

export default function completeLegendConfig<Output extends Value = Value>(
  channelDef: ChannelDef<Output>,
): CompleteLegendConfig {
  if ('legend' in channelDef) {
    const { legend } = channelDef;

    if (legend === false) {
      return false;
    } else if (legend === undefined) {
      return {};
    }

    return legend;
  }

  return {};
}
