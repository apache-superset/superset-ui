import { isDefined } from '@superset-ui/core';
import { TextStyle } from './types';

const SVG_NS = 'http://www.w3.org/2000/svg';
const STYLE_FIELDS = ['font', 'fontWeight', 'fontStyle', 'fontSize', 'fontFamily', 'letterSpacing'];

export interface GetTextDimensionInput {
  className?: string;
  container?: HTMLElement;
  style?: TextStyle;
  text: string;
}

export default function getTextDimension(input: GetTextDimensionInput) {
  const { text, className, style, container = document.body } = input;

  const textNode = document.createElementNS(SVG_NS, 'text');
  textNode.textContent = text;

  if (isDefined(className)) {
    textNode.setAttribute('class', className);
  }

  if (isDefined(style)) {
    STYLE_FIELDS.filter(field => isDefined(style[field])).forEach(field => {
      textNode.style[field] = style[field];
    });
  }

  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute'; // so it won't disrupt page layout
  svg.style.opacity = '0'; // and not visible
  svg.appendChild(textNode);
  container.appendChild(svg);

  const bbox = textNode.getBBox ? textNode.getBBox() : { height: 100, width: 100 };
  container.removeChild(svg);

  return {
    height: Math.ceil(bbox.height),
    width: Math.ceil(bbox.width),
  };
}
