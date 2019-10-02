import { ChannelDef } from '../types/ChannelDef';
import { Value } from '../types/VegaLite';
import { Legend } from '../types/Legend';

export type CompleteLegendConfig = false | Legend;

export default function completeLegendConfig<Output extends Value = Value>(
  channelDef: ChannelDef<Output>,
): CompleteLegendConfig {
  if ('legend' in channelDef) {
    const { legend } = channelDef;

    return legend === false || legend === null ? false : {};
  }

  return {};
}
