import { isDefined } from '@superset-ui/core';
import getTextDimension, { GetTextDimensionInput } from './getTextDimension';

export default function computeMaxFontSize(
  input: GetTextDimensionInput & {
    maxWidth?: number;
    maxHeight?: number;
    idealFontSize?: number;
  },
) {
  const { idealFontSize, maxWidth, maxHeight, style, ...rest } = input;

  let size: number = idealFontSize;
  if (!isDefined(idealFontSize)) {
    if (isDefined(maxHeight)) {
      size = Math.floor(maxHeight);
    } else {
      throw new Error('You must specify at least one of maxHeight or idealFontSize');
    }
  }

  function computeDimension(fontSize: number) {
    return getTextDimension({
      ...rest,
      style: { ...style, fontSize },
    });
  }

  let textDimension = computeDimension(size);

  // Decrease size until textWidth is less than maxWidth
  if (isDefined(maxWidth)) {
    while (textDimension.width > maxWidth) {
      size -= 2;
      textDimension = computeDimension(size);
    }
  }

  // Decrease size until textHeight is less than maxHeight
  if (isDefined(maxHeight)) {
    while (textDimension.height > maxHeight) {
      size -= 2;
      textDimension = computeDimension(size);
    }
  }

  return size;
}
