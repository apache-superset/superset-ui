import { ExtensibleFunction } from '@superset-ui/core';

export function cleanValue(value) {
  // for superset series that should have the same color
  return String(value).trim();
}

export default class CategoricalColorScale extends ExtensibleFunction {
  /**
   * Constructor
   * @param {*} colors an array of colors
   * @param {*} parentForcedColors optional parameter that comes from parent
   * (usually CategoricalColorNamespace) and supersede this.forcedColors
   */
  constructor(colors, parentForcedColors) {
    super((...args) => this.getColor(...args));
    this.colors = colors;
    this.parentForcedColors = parentForcedColors;
    this.forcedColors = {};
    this.seen = {};
  }

  getColor(value) {
    const cleanedValue = cleanValue(value);

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
  setColor(value, forcedColor) {
    this.forcedColors[cleanValue(value)] = forcedColor;

    return this;
  }
}
