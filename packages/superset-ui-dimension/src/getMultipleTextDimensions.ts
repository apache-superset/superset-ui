import { TextStyle, Dimension } from './types';
import createTextNode from './svg/createTextNode';
import createHiddenSvgNode from './svg/createHiddenSvgNode';
import getBBoxCeil from './svg/getBBoxCeil';

/**
 * get dimensions of multiple texts with same style
 * @param input
 * @param defaultDimension
 */
export default function getMultipleTextDimensions(
  input: {
    className?: string;
    container?: HTMLElement;
    style?: TextStyle;
    texts: string[];
  },
  defaultDimension?: Dimension,
): Dimension[] {
  const { texts, className, style, container = document.body } = input;

  const cache = new Map<string, Dimension>();
  let textNode: SVGTextElement | undefined;
  let svgNode: SVGSVGElement | undefined;

  const dimensions = texts.map(text => {
    // Empty string
    if (text.length === 0) {
      return { height: 0, width: 0 };
    }
    // Check if this string has been computed already
    if (cache.has(text)) {
      return cache.get(text) as Dimension;
    }

    // Lazy creation of text and svg nodes
    if (!textNode) {
      textNode = createTextNode({ className, style });
      svgNode = createHiddenSvgNode();
      svgNode.appendChild(textNode);
      container.appendChild(svgNode);
    }

    // Update text and get dimension
    textNode.textContent = text;
    const dimension = getBBoxCeil(textNode, defaultDimension);
    // Store result to cache
    cache.set(text, dimension);

    return dimension;
  });

  // Remove svg node, if any
  if (svgNode) {
    container.removeChild(svgNode);
  }

  return dimensions;
}
