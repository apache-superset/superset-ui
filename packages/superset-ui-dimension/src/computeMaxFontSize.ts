import getTextDimension, { GetTextDimensionInput } from './getTextDimension';

export default function computeMaxFontSize(
  input: GetTextDimensionInput & {
    maxWidth?: number;
    maxHeight?: number;
    idealFontSize?: number;
  },
) {
  const { idealFontSize, maxWidth, maxHeight, style, ...rest } = input;

  let size: number;
  if (idealFontSize !== undefined) {
    size = idealFontSize;
  } else if (maxHeight === undefined) {
    throw new Error('You must specify at least one of maxHeight or idealFontSize');
  } else {
    size = Math.floor(maxHeight);
  }

  function computeDimension(fontSize: number) {
    return getTextDimension({
      ...rest,
      style: { ...style, fontSize },
    });
  }

  let textDimension = computeDimension(size);

  // Decrease size until textWidth is less than maxWidth
  if (maxWidth !== undefined) {
    while (textDimension.width > maxWidth) {
      size -= 1;
      textDimension = computeDimension(size);
    }
  }

  // Decrease size until textHeight is less than maxHeight
  if (maxHeight !== undefined) {
    while (textDimension.height > maxHeight) {
      size -= 1;
      textDimension = computeDimension(size);
    }
  }

  return size;
}
