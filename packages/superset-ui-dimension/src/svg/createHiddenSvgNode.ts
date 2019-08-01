import { SVG_NS } from './constants';

const cache = new Map<
  HTMLElement,
  {
    counter: number;
    svgNode: SVGSVGElement;
  }
>();

export function createHiddenSvgNode(container: HTMLElement = document.body) {
  if (cache.has(container)) {
    const entry = cache.get(container)!;
    entry.counter += 1;

    return entry.svgNode;
  }

  const svgNode = document.createElementNS(SVG_NS, 'svg');
  svgNode.style.position = 'absolute'; // so it won't disrupt page layout
  svgNode.style.opacity = '0'; // and not visible
  svgNode.style.pointerEvents = 'none'; // and not capturing mouse events
  container.appendChild(svgNode);

  cache.set(container, { counter: 1, svgNode });

  return svgNode;
}

export function removeHiddenSvgNode(container: HTMLElement = document.body) {
  if (cache.has(container)) {
    const entry = cache.get(container)!;
    entry.counter -= 1;
    if (entry.counter === 0) {
      container.removeChild(entry.svgNode);
      cache.delete(container);
    }
  }
}
