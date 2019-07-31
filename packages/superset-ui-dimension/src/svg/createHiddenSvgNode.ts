import { SVG_NS } from './constants';

export default function createHiddenSvgNode() {
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute'; // so it won't disrupt page layout
  svg.style.opacity = '0'; // and not visible
  svg.style.pointerEvents = 'none'; // and not capturing mouse events

  return svg;
}
