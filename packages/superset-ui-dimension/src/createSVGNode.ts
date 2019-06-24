import { TextStyle } from './types';

export interface CreateSVGNodeInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
}

const SVG_NS = 'http://www.w3.org/2000/svg';
const STYLE_FIELDS: (keyof TextStyle)[] = [
  'font',
  'fontWeight',
  'fontStyle',
  'fontSize',
  'fontFamily',
  'letterSpacing',
];

export default function createSVGNode(input: CreateSVGNodeInput): SVGSVGElement {
  const { className, style = {}, container = document.body } = input;

  const textNode = document.createElementNS(SVG_NS, 'text');
  if (className !== undefined && className !== null) {
    textNode.setAttribute('class', className);
  }
  STYLE_FIELDS.filter(
    (field: keyof TextStyle) => style[field] !== undefined && style[field] !== null,
  ).forEach((field: keyof TextStyle) => {
    textNode.style[field] = `${style[field]}`;
  });

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute'; // so it won't disrupt page layout
  svg.style.opacity = '0'; // and not visible
  svg.style.pointerEvents = 'none'; // and not capturing mouse events
  svg.appendChild(textNode);
  container.appendChild(svg);

  return svg;
}
