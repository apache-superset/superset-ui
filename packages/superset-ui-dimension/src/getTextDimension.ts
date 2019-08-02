import { TextStyle, Dimension } from './types';
import updateTextNode from './svg/updateTextNode';
import getBBoxCeil from './svg/getBBoxCeil';
import { hiddenSvgFactory, textFactory } from './svg/factories';

export interface GetTextDimensionInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
  text: string;
}

export default function getTextDimension(
  input: GetTextDimensionInput,
  defaultDimension?: Dimension,
): Dimension {
  const { text, className, style, container } = input;

  // Empty string
  if (text.length === 0) {
    return { height: 0, width: 0 };
  }

  const svgNode = hiddenSvgFactory.createInContainer(container);
  const textNode = textFactory.createInContainer(svgNode);
  updateTextNode(textNode, { className, style, text });
  const dimension = getBBoxCeil(textNode, defaultDimension);

  setTimeout(() => {
    textFactory.removeFromContainer(svgNode);
    hiddenSvgFactory.removeFromContainer(container);
    // eslint-disable-next-line no-magic-numbers
  }, 500);

  return dimension;
}
