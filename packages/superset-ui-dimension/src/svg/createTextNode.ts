import { TextStyle } from '../types';
import { SVG_NS } from './constants';

const STYLE_FIELDS: (keyof TextStyle)[] = [
  'font',
  'fontWeight',
  'fontStyle',
  'fontSize',
  'fontFamily',
  'letterSpacing',
];

export default function createTextNode({
  className,
  style = {},
  text,
}: {
  className?: string;
  style?: TextStyle;
  text?: string;
} = {}) {
  const textNode = document.createElementNS(SVG_NS, 'text');
  if (typeof text !== 'undefined') {
    textNode.textContent = text;
  }

  if (typeof className !== 'undefined' && className !== null) {
    textNode.setAttribute('class', className);
  }

  STYLE_FIELDS.filter(
    (field: keyof TextStyle) => style[field] !== undefined && style[field] !== null,
  ).forEach((field: keyof TextStyle) => {
    textNode.style[field] = `${style[field]}`;
  });

  return textNode;
}
