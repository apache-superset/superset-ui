import { ChannelDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import { isFieldDef } from '../typeGuards/ChannelDef';
import fillAxisConfig, { FilledAxisConfig } from './fillAxisConfig';
import fillScaleConfig, { FilledScaleConfig } from './fillScaleConfig';
import { Value } from '../types/VegaLite';

type FilledChannelDef<Output extends Value = Value> = Omit<
  ChannelDef,
  'title' | 'axis' | 'scale'
> & {
  axis: FilledAxisConfig;
  scale: FilledScaleConfig<Output>;
  title: string;
};

export default function fillMissingPropertiesInChannelDef<Output extends Value = Value>(
  channelType: ChannelType,
  channelDef: ChannelDef<Output>,
): FilledChannelDef<Output> {
  // Fill top-level properties
  const copy = {
    ...channelDef,
    title: isFieldDef(channelDef) ? channelDef.title || channelDef.field : '',
  };

  return {
    ...copy,
    axis: fillAxisConfig(channelType, copy),
    scale: fillScaleConfig(channelType, copy),
  };
}
