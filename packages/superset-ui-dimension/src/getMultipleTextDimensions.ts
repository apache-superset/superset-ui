import { TextStyle, Dimension } from './types';
import getBBoxCeil from './svg/getBBoxCeil';
import { hiddenSvgFactory, textFactory } from './svg/factories';
import updateTextNode from './svg/updateTextNode';

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
  const { texts, className, style, container } = input;

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
      svgNode = hiddenSvgFactory.createInContainer(container);
      textNode = textFactory.createInContainer(svgNode);
    }

    // Update text and get dimension
    updateTextNode(textNode, { className, style, text });
    const dimension = getBBoxCeil(textNode, defaultDimension);
    // Store result to cache
    cache.set(text, dimension);

    return dimension;
  });

  // Remove svg node, if any
  if (svgNode && textNode) {
    setTimeout(() => {
      textFactory.removeFromContainer(svgNode);
      hiddenSvgFactory.removeFromContainer(container);
      // eslint-disable-next-line no-magic-numbers
    }, 500);
  }

  return dimensions;
}
