/* eslint-disable no-magic-numbers */
import isEnabled from '../utils/isEnabled';
import { isPositionFieldDef } from '../typeGuards/ChannelDef';
import { ChannelDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';

export default function fillAxis(channelDef: ChannelDef, channelType: ChannelType) {
  if (isPositionFieldDef(channelDef) && isEnabled(channelDef.axis)) {
    const axis =
      channelDef.axis === true || typeof channelDef.axis === 'undefined' ? {} : channelDef.axis;

    const isX = channelType === 'X' || channelType === 'XBand';

    const {
      format = channelDef.format,
      labelAngle = isX ? 40 : 0,
      labelFlush = true,
      labelOverlap = 'auto',
      labelPadding = 4,
      orient = isX ? 'bottom' : 'left',
      tickCount = 5,
      title = channelDef.title,
    } = axis;

    return {
      ...axis,
      format,
      labelAngle,
      labelFlush,
      labelOverlap,
      labelPadding,
      orient,
      tickCount,
      title,
    };
  }

  return false as const;
}
