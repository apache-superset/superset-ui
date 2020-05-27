import { scaleLinear } from 'd3-scale';
import { interpolateHcl } from 'd3-interpolate';
import ColorScheme, { ColorSchemeConfig } from './ColorScheme';

function range(count: number) {
  const values: number[] = [];
  for (let i = 0; i < count; i += 1) {
    values.push(i);
  }

  return values;
}

function rangeZeroToOne(steps: number) {
  const denominator = steps - 1;
  return range(steps).map(i => i / denominator);
}

export interface SequentialSchemeConfig extends ColorSchemeConfig {
  isDiverging?: boolean;
}

export default class SequentialScheme extends ColorScheme {
  isDiverging: boolean;

  constructor(config: SequentialSchemeConfig) {
    super(config);
    const { isDiverging = false } = config;
    this.isDiverging = isDiverging;
  }

  /**
   * Create a linear scale using the colors in this scheme as a range
   * and interpolate domain [0, 1]
   * to match the number of elements in the range
   * e.g.
   * If the range is ['red', 'white', 'blue']
   * the domain of this scale will be
   * [0, 0.5, 1]
   */
  private createZeroToOnePiecewiseScale() {
    return scaleLinear<string>()
      .domain(rangeZeroToOne(this.colors.length))
      .range(this.colors)
      .interpolate(interpolateHcl)
      .clamp(true);
  }

  /**
   * Return a linear scale with a new domain interpolated from the input domain
   * to match the number of elements in the color scheme
   * because D3 continuous scale uses piecewise mapping between domain and range.
   * This is a common use-case when the domain is [min, max]
   * and the palette has more than two colors.
   *
   * @param domain domain of the scale
   * @param modifyRange Set this to true if you don't want to modify the domain and
   * want to interpolate range to have the same number of elements with domain instead.
   */
  createLinearScale(domain: number[] = [0, 1], modifyRange = false) {
    if (modifyRange || domain.length === this.colors.length) {
      return scaleLinear<string>()
        .interpolate(interpolateHcl)
        .domain(domain)
        .range(this.getColors(domain.length));
    }

    const piecewiseScale = this.createZeroToOnePiecewiseScale();
    const adjustDomain = scaleLinear()
      .domain(rangeZeroToOne(domain.length))
      .range(domain)
      .clamp(true);
    const newDomain = piecewiseScale.domain().map(d => adjustDomain(d));

    return piecewiseScale.domain(newDomain);
  }

  /**
   * Get colors from this scheme
   * @param numColors number of colors to return.
   * Will interpolate the current scheme to match the number of colors requested
   * @param extent The extent of the color range to use.
   * For example [0.2, 1] will rescale the color scheme
   * such that color values in the range [0, 0.2) are excluded from the scheme.
   */
  getColors(numColors: number = this.colors.length, extent: number[] = [0, 1]): string[] {
    if (numColors === this.colors.length) {
      return this.colors;
    }

    const piecewiseScale = this.createZeroToOnePiecewiseScale();
    const adjustExtent = scaleLinear().range(extent).clamp(true);

    return rangeZeroToOne(numColors).map(x => piecewiseScale(adjustExtent(x)));
  }
}
