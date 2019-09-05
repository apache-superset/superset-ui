/* eslint-disable no-magic-numbers */
import isEnabled from '../utils/isEnabled';
import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import { ChannelDef, PositionFieldDef } from '../types/ChannelDef';
import { ChannelType } from '../types/Channel';
import { isXY, isX } from '../typeGuards/Channel';
import { RequiredSome } from '../types/Base';
import { AxisConfig, LabelOverlapStrategy, LabelOverlapType } from '../types/Axis';

function isChannelDefWithAxisSupport(
  channelDef: ChannelDef,
  channelType: ChannelType,
): channelDef is PositionFieldDef {
  return isTypedFieldDef(channelDef) && isXY(channelType);
}

const STRATEGY_FLAT = { strategy: 'flat' } as const;
const STRATEGY_ROTATE = { labelAngle: 40, strategy: 'rotate' } as const;

function expandLabelOverlapStrategy(
  labelOverlap: LabelOverlapType = 'auto',
  channelType: ChannelType,
): LabelOverlapStrategy {
  let output: LabelOverlapStrategy;
  switch (labelOverlap) {
    case 'flat':
      output = STRATEGY_FLAT;
      break;
    case 'rotate':
      output = STRATEGY_ROTATE;
      break;
    case 'auto':
      output = isX(channelType) ? STRATEGY_ROTATE : STRATEGY_FLAT;
      break;
    default:
      output = labelOverlap;
      break;
  }

  return { ...output };
}

export default function fillAxisConfig(channelDef: ChannelDef, channelType: ChannelType) {
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
      labelOverlap: expandLabelOverlapStrategy(labelOverlap, channelType),
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
