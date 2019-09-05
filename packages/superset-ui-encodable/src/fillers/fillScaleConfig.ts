import { isTypedFieldDef } from '../typeGuards/ChannelDef';
import inferScaleType from './inferScaleType';
import { isContinuousScaleConfig, isScaleConfigWithZero } from '../typeGuards/Scale';
import { ScaleConfig } from '../types/Scale';
import { ChannelDef } from '../types/ChannelDef';
import isEnabled from '../utils/isEnabled';
import { ChannelType } from '../types/Channel';

export default function fillScaleConfig(channelType: ChannelType, channelDef: ChannelDef) {
  if (isTypedFieldDef(channelDef) && isEnabled(channelDef.scale)) {
    const { scale = {}, type, bin } = channelDef;
    const { type: scaleType = inferScaleType(channelType, type, bin) } = scale;

    if (typeof scaleType === 'undefined') {
      return false;
    }

    const filledScale = { ...scale, type: scaleType } as ScaleConfig;
    if (isContinuousScaleConfig(filledScale)) {
      if (typeof filledScale.nice === 'undefined') {
        filledScale.nice = true;
      }
      if (typeof filledScale.clamp === 'undefined') {
        filledScale.clamp = true;
      }
    }
    if (isScaleConfigWithZero(filledScale) && typeof filledScale.zero === 'undefined') {
      filledScale.zero = true;
    }

    return filledScale;
  }

  return false as const;
}
