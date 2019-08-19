import { Type, ScaleType } from '../types/VegaLite';
import { ChannelType } from '../types/Channel';

// eslint-disable-next-line complexity
export default function inferScaleType(
  fieldType: Type | undefined,
  channelType: ChannelType,
  isBinned: boolean = false,
): ScaleType | undefined {
  if (typeof fieldType === 'undefined') {
    return undefined;
  } else if (fieldType === 'nominal' || fieldType === 'ordinal') {
    switch (channelType) {
      // For positional (x and y) ordinal and ordinal fields,
      // "point" is the default scale type for all marks
      // except bar and rect marks, which use "band" scales.
      // https://vega.github.io/vega-lite/docs/scale.html
      case 'XBand':
      case 'YBand':
        return ScaleType.BAND;
      case 'X':
      case 'Y':
      case 'Numeric':
        return ScaleType.POINT;
      case 'Color':
      case 'Category':
        return ScaleType.ORDINAL;
      default:
    }
  } else if (fieldType === 'quantitative') {
    switch (channelType) {
      case 'XBand':
      case 'YBand':
      case 'X':
      case 'Y':
      case 'Numeric':
        return ScaleType.LINEAR;
      case 'Color':
        return isBinned ? ScaleType.LINEAR : ScaleType.BIN_ORDINAL;
      default:
    }
  } else if (fieldType === 'temporal') {
    switch (channelType) {
      case 'XBand':
      case 'YBand':
      case 'X':
      case 'Y':
      case 'Numeric':
        return ScaleType.TIME;
      case 'Color':
        return ScaleType.LINEAR;
      default:
    }
  }

  return undefined;
}
