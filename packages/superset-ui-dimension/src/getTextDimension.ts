import { TextStyle, Dimension } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const STYLE_FIELDS: (keyof TextStyle)[] = [
  'font',
  'fontWeight',
  'fontStyle',
  'fontSize',
  'fontFamily',
  'letterSpacing',
];

export interface GetTextDimensionInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
  text: string;
}

const DEFAULT_DIMENSION = { height: 20, width: 100 };

export function createSVGNode(container: HTMLElement): SVGSVGElement {
  const textNode = document.createElementNS(SVG_NS, 'text');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute'; // so it won't disrupt page layout
  svg.style.opacity = '0'; // and not visible
  svg.style.pointerEvents = 'none'; // and not capturing mouse events
  svg.appendChild(textNode);
  container.appendChild(svg);

  return svg;
}

export default function getTextDimension(
  input: GetTextDimensionInput,
  defaultDimension: Dimension = DEFAULT_DIMENSION,
  existingSVGNode?: SVGSVGElement,
): Dimension {
  const { text, className, style = {}, container = document.body } = input;

  const svg = existingSVGNode || createSVGNode(container);
  const textNode = svg.lastElementChild as SVGSVGElement;
  textNode.textContent = text;

  if (className !== undefined && className !== null) {
    textNode.setAttribute('class', className);
  }

  STYLE_FIELDS.filter(
    (field: keyof TextStyle) => style[field] !== undefined && style[field] !== null,
  ).forEach((field: keyof TextStyle) => {
    textNode.style[field] = `${style[field]}`;
  });

  const bbox = textNode.getBBox ? textNode.getBBox() : defaultDimension;

  if (!existingSVGNode) {
    container.removeChild(svg);
  }

  return {
    height: Math.ceil(bbox.height),
    width: Math.ceil(bbox.width),
  };
}
