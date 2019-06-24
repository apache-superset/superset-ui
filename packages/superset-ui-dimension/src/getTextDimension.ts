import { TextStyle, Dimension } from './types';
import createSVGNode from './createSVGNode';

export interface GetTextDimensionInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
  text: string;
}

const DEFAULT_DIMENSION = { height: 20, width: 100 };

export default function getTextDimension(
  input: GetTextDimensionInput,
  defaultDimension: Dimension = DEFAULT_DIMENSION,
  existingSVGNode?: SVGSVGElement,
): Dimension {
  const { text, className, style = {}, container = document.body } = input;

  const svg = existingSVGNode || createSVGNode({ className, style, container });
  const textNode = svg.lastElementChild as SVGSVGElement;
  textNode.textContent = text;
  const bbox = textNode.getBBox ? textNode.getBBox() : defaultDimension;

  if (!existingSVGNode) {
    container.removeChild(svg);
  }

  return {
    height: Math.ceil(bbox.height),
    width: Math.ceil(bbox.width),
  };
}
