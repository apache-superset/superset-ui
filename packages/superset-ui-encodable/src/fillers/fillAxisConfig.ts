/* eslint-disable no-magic-numbers */
import isEnabled from '../utils/isEnabled';
import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import { ChannelDef, PositionFieldDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import { isXY, isX } from '../typeGuards/Channel';
import { RequiredSome } from '../types/Base';
import { AxisConfig, LabelOverlapStrategy } from '../types/Axis';
import expandLabelOverlapStrategy from './expandLabelOverlapStrategy';

function isChannelDefWithAxisSupport(
  channelDef: ChannelDef,
  channelType: ChannelType,
): channelDef is PositionFieldDef {
  return isTypedFieldDef(channelDef) && isXY(channelType);
}

export default function fillAxisConfig(channelType: ChannelType, channelDef: ChannelDef) {
  if (isChannelDefWithAxisSupport(channelDef, channelType) && isEnabled(channelDef.axis)) {
    const axis =
      channelDef.axis === true || typeof channelDef.axis === 'undefined' ? {} : channelDef.axis;

    const isXChannel = isX(channelType);

    const {
      format = channelDef.format,
      labelAngle = 0,
      labelFlush = true,
      labelOverlap,
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
      labelOverlap: expandLabelOverlapStrategy(channelType, labelOverlap),
      labelPadding,
      orient,
      tickCount,
      ticks,
      title,
      titlePadding,
    } as RequiredSome<
      Omit<AxisConfig, 'labelOverlap'>,
      | 'format'
      | 'labelAngle'
      | 'labelFlush'
      | 'labelPadding'
      | 'orient'
      | 'tickCount'
      | 'ticks'
      | 'title'
      | 'titlePadding'
    > & {
      labelOverlap: LabelOverlapStrategy;
    };
  }

  return false as const;
}
