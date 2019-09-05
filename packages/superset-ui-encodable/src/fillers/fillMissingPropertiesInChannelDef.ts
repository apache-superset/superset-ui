import { ChannelDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import fillAxisConfig from './fillAxisConfig';
import fillScaleConfig from './fillScaleConfig';
import { isFieldDef } from '../typeGuards/ChannelDef';

export default function fillMissingPropertiesInChannelDef(
  channelType: ChannelType,
  channelDef: ChannelDef,
) {
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
