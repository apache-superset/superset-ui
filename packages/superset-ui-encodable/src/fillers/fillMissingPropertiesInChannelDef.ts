import { ChannelDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import fillAxisConfig, { FilledAxisConfig } from './fillAxisConfig';
import fillScaleConfig from './fillScaleConfig';
import { isFieldDef } from '../typeGuards/ChannelDef';

type FilledChannelDef = Omit<ChannelDef, 'title' | 'axis' | 'scale'> & {
  axis: FilledAxisConfig;
  scale: ReturnType<typeof fillScaleConfig>;
  title: string;
};

export default function fillMissingPropertiesInChannelDef(
  channelType: ChannelType,
  channelDef: ChannelDef,
): FilledChannelDef {
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
