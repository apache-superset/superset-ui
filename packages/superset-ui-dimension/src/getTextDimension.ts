import { TextStyle, Dimension } from './types';
import createSVGNode from './createSVGNode';

export interface GetTextDimensionInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
  text: string;
  existingSVGNode?: SVGSVGElement;
}

const DEFAULT_DIMENSION = { height: 20, width: 100 };

export default function getTextDimension(
  input: GetTextDimensionInput,
  defaultDimension: Dimension = DEFAULT_DIMENSION,
): Dimension {
  /*
   * Compute dimensions (height, width) of a text string.
   *
   * When calling this function you can specify a container and formatting
   * attributes that will be applied to the text (class name and CSS style).
   * An SVG element will be appended to the container, and child text element
   * will store the text string in order to compute its dimensions based on its
   * bounding box.
   *
   * Alternatively, for improved performance, it is also possible instead to
   * pass a pre-existing SVG node, created with `createSVGNode`. This is the
   * recommended approach if you need to compute the dimensions of a high
   * number of text strings, since it minimizes changes to the DOM.
   *
   * Note that if you pass a pre-existing SVG node you need to remove it
   * yourself when it is no longer needed.
   */
  const { text, className, style = {}, container = document.body, existingSVGNode } = input;

  const svg = existingSVGNode || createSVGNode({ className, container, style });
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
