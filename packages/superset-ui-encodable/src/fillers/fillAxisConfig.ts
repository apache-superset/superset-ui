/* eslint-disable no-magic-numbers */
import isEnabled from '../utils/isEnabled';
import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import { ChannelDef, PositionFieldDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import { isXY, isX } from '../typeGuards/Channel';

function isChannelDefWithAxisSupport(
  channelDef: ChannelDef,
  channelType: ChannelType,
): channelDef is PositionFieldDef {
  return isTypedFieldDef(channelDef) && isXY(channelType);
}

export default function fillAxisConfig(channelDef: ChannelDef, channelType: ChannelType) {
  if (isChannelDefWithAxisSupport(channelDef, channelType) && isEnabled(channelDef.axis)) {
    const axis =
      channelDef.axis === true || typeof channelDef.axis === 'undefined' ? {} : channelDef.axis;

    const isXChannel = isX(channelType);

    const {
      format = channelDef.format,
      labelAngle = isXChannel ? 40 : 0,
      labelFlush = true,
      labelOverlap = 'auto',
      labelPadding = 4,
      orient = isXChannel ? 'bottom' : 'left',
      tickCount = 5,
      ticks = true,
      title = channelDef.title,
      titlePadding = 4,
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
      ticks,
      title,
      titlePadding,
    };
  }

  return false as const;
}
