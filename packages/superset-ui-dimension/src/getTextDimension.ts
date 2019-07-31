import { TextStyle, Dimension } from './types';
import createTextNode from './svg/createTextNode';
import createHiddenSvgNode from './svg/createHiddenSvgNode';
import getBBoxCeil from './svg/getBBoxCeil';

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
  const { text, className, style, container = document.body } = input;

  // Empty string
  if (text.length === 0) {
    return { height: 0, width: 0 };
  }

  const textNode = createTextNode({ className, style, text });
  const svgNode = createHiddenSvgNode();
  svgNode.appendChild(textNode);
  container.appendChild(svgNode);
  const dimension = getBBoxCeil(textNode, defaultDimension);
  container.removeChild(svgNode);

  return dimension;
}
