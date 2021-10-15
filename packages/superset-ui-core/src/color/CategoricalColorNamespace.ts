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

  constructor(name: string) {
    this.name = name;
    this.scales = {};
    this.forcedItems = {};
  }

  getScale(schemeId?: string) {
    const id = schemeId ?? getCategoricalSchemeRegistry().getDefaultKey() ?? '';
    const scheme = getCategoricalSchemeRegistry().get(id);
    const forcedColors = this.forcedItems;
    const newScale = new CategoricalColorScale(scheme?.colors ?? [], forcedColors);

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

  resetColors() {
    this.forcedItems = {};
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
  Returns a new scale instance within the same namespace.
  Especially useful when a chart is booting for the first time
*/
export function getScale(scheme?: string, namespace?: string) {
  return getNamespace(namespace).getScale(scheme);
}
