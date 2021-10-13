import CategoricalColorScale from './CategoricalColorScale';
import { ColorsLookup } from './types';
import getCategoricalSchemeRegistry from './CategoricalSchemeRegistrySingleton';
import stringifyAndTrim from './stringifyAndTrim';

export default class CategoricalColorNamespace {
  name: string;

  forcedItems: ColorsLookup;

  scales: {
    [key: string]: CategoricalColorScale;
  };

  schemeColors: {
    [key: string]: {
      [key: string]: string;
    };
  };

  constructor(name: string) {
    this.name = name;
    this.scales = {};
    this.forcedItems = {};
    this.schemeColors = {};
  }

  getScale(schemeId?: string, existingScale?: boolean) {
    const id = schemeId ?? getCategoricalSchemeRegistry().getDefaultKey() ?? '';
    const scheme = getCategoricalSchemeRegistry().get(id);
    const forcedColors = { ...this.forcedItems, ...(this.schemeColors?.[id] || {}) };

    if (existingScale && this.scales[id]) {
      return this.scales[id];
    }

    const newScale = new CategoricalColorScale(scheme?.colors ?? [], forcedColors);
    this.scales[id] = newScale;

    return newScale;
  }

  /**
   * Enforce specific color for given value
   * This will apply across all color scales
   * in this namespace.
   * @param {*} value value
   * @param {*} forcedColor color
   */
  setColor(value: string, forcedColor: string) {
    this.forcedItems[stringifyAndTrim(value)] = forcedColor;

    return this;
  }

  setSchemeColor(scheme: string, name: string, color: string) {
    if (!this.schemeColors[scheme]) {
      this.schemeColors[scheme] = {};
    }

    this.schemeColors[scheme][name] = color;
  }
}

const namespaces: {
  [key: string]: CategoricalColorNamespace;
} = {};

export const DEFAULT_NAMESPACE = 'GLOBAL';

export function getNamespace(name: string = DEFAULT_NAMESPACE) {
  const instance = namespaces[name];
  if (instance) {
    return instance;
  }
  const newInstance = new CategoricalColorNamespace(name);
  namespaces[name] = newInstance;

  return newInstance;
}

export function getColor(value?: string, schemeId?: string, namespace?: string) {
  return getNamespace(namespace).getScale(schemeId).getColor(value);
}

/*
  Returns a new scale instance.
  Especially useful when a chart is booting or when an existing 
  color scale instance is not necessary
*/
export function getScale(scheme?: string, namespace?: string) {
  return getNamespace(namespace).getScale(scheme);
}

/*
  Returns an existing color scale instance.
  Especially useful when a chart has booted already and the existing
  color scale instance should be used
*/
export function getExistingScale(scheme?: string, namespace?: string) {
  return getNamespace(namespace).getScale(scheme, true);
}

/*
  Statically map specific colors to specific values for a color scheme. 
  Especially useful for custom label colors
*/
export function setSchemeColor(scheme: string, namespace: string, name: string, color: string) {
  return getNamespace(namespace).setSchemeColor(scheme, name, color);
}
