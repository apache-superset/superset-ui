/* eslint-disable no-dupe-class-members */
import { ExtensibleFunction } from '@superset-ui/core';
import { ColorsLookup } from './types';
import stringifyAndTrim from './stringifyAndTrim';

// Use type augmentation to correct the fact that
// an instance of CategoricalScale is also a function

interface CategoricalColorScale {
  (x: { toString(): string }): string;
}

class CategoricalColorScale extends ExtensibleFunction {
  colors: string[];

  parentForcedColors?: ColorsLookup;

  forcedColors: ColorsLookup;

  seen: { [key: string]: number };

  /**
   * Constructor
   * @param {*} colors an array of colors
   * @param {*} parentForcedColors optional parameter that comes from parent
   * (usually CategoricalColorNamespace) and supersede this.forcedColors
   */
  constructor(colors: string[], parentForcedColors?: ColorsLookup) {
    super((value: string) => this.getColor(value));
    this.colors = colors;
    this.parentForcedColors = parentForcedColors;
    this.forcedColors = {};
    this.seen = {};
  }

  getColor(value?: string) {
    const cleanedValue = stringifyAndTrim(value);

    const parentColor = this.parentForcedColors && this.parentForcedColors[cleanedValue];
    if (parentColor) {
      return parentColor;
    }

    const forcedColor = this.forcedColors[cleanedValue];
    if (forcedColor) {
      return forcedColor;
    }

    const seenColor = this.seen[cleanedValue];
    const { length } = this.colors;
    if (seenColor !== undefined) {
      return this.colors[seenColor % length];
    }

    const index = Object.keys(this.seen).length;
    this.seen[cleanedValue] = index;

    return this.colors[index % length];
  }

  /**
   * Enforce specific color for given value
   * @param {*} value value
   * @param {*} forcedColor forcedColor
   */
  setColor(value: string, forcedColor: string) {
    this.forcedColors[stringifyAndTrim(value)] = forcedColor;

    return this;
  }

  /**
   * Get a mapping of data values to colors
   * @returns an object where the key is the data value and the value is the hex color code
   */
  getColorMap() {
    const colorMap: { [key: string]: string } = {};
    const { length } = this.colors;
    Object.keys(this.seen).forEach(value => {
      colorMap[value] = this.colors[this.seen[value] % length];
    });

    return {
      ...colorMap,
      ...this.forcedColors,
      ...this.parentForcedColors,
    };
  }

  /**
   * Returns an exact copy of this scale. Changes to this scale will not affect the returned scale, and vice versa.
   */
  copy() {
    const scale = new CategoricalColorScale(this.colors, this.parentForcedColors);
    scale.forcedColors = { ...this.forcedColors };
    scale.seen = { ...this.seen };

    return scale;
  }

  /**
   * Returns the scale's current domain.
   */
  domain(): { toString(): string }[];

  /**
   * Expands the domain to include the specified array of values.
   */
  domain(newDomain: { toString(): string }[]): this;

  domain(newDomain?: { toString(): string }[]): unknown {
    if (typeof newDomain === 'undefined') {
      return Object.keys(this.seen);
    }

    newDomain.forEach(d => this.getColor(`${d}`));
    return this;
  }

  /**
   * Returns the scale's current range.
   */
  range(): string[];

  /**
   * Sets the range of the ordinal scale to the specified array of values.
   *
   * The first element in the domain will be mapped to the first element in range, the second domain value to the second range value, and so on.
   *
   * If there are fewer elements in the range than in the domain, the scale will reuse values from the start of the range.
   *
   * @param range Array of range values.
   */
  range(newRange: string[]): this;

  range(newRange?: string[]): unknown {
    if (typeof newRange === 'undefined') {
      return this.colors;
    }

    this.colors = newRange;
    return this;
  }

  /**
   * Returns the current unknown value, which defaults to "implicit".
   */
  unknown(): { name: 'implicit' };

  /**
   * This method does nothing and returns the scale
   * because CategoricalColorScale always extends the domain to include unknown values.
   * This is different from D3's scaleOrdinal behavior
   * that sets the output value of the scale for unknown input values and returns this scale.
   *
   * @param value Unknown value to be used or scaleImplicit to set implicit scale generation.
   */
  unknown(value: string): this;

  unknown(value?: string): unknown {
    if (typeof value === 'undefined') {
      return { name: 'implicit' };
    }

    return this;
  }
}

export default CategoricalColorScale;
