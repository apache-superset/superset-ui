import { createRegistryWithDefaultKey } from '@superset-ui/core';

export default class ColorSchemeRegistry extends createRegistryWithDefaultKey({
  keyLabel: 'schemeName',
  setFirstItemAsDefault: true,
}) {}
