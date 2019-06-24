export default function createSVGNode(container: HTMLElement): SVGSVGElement {
  const textNode = document.createElementNS(SVG_NS, 'text');
  const svg = document.createElementNS(SVG_NS, 'svg');
  svg.style.position = 'absolute'; // so it won't disrupt page layout
  svg.style.opacity = '0'; // and not visible
  svg.style.pointerEvents = 'none'; // and not capturing mouse events
  svg.appendChild(textNode);
  container.appendChild(svg);

  return svg;
}
