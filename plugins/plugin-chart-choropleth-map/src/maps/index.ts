import { keyBy } from 'lodash/fp';
import { RawMapMetadata } from '../types';

// Edit here if you are adding new map
const mapsInfo: Record<string, Omit<RawMapMetadata, 'key'>> = {
  usa: {
    name: 'USA',
    type: 'topojson',
    // @ts-ignore
    load: () => import('./usa-topo.json'),
    keyField: 'properties.STATE',
    projection: 'Albers',
  },
  world: {
    name: 'World Map',
    type: 'topojson',
    // @ts-ignore
    load: () => import('./world-topo.json'),
    keyField: 'id',
    projection: 'Equirectangular',
    rotate: [-9, 0, 0],
  },
};

/** List of available maps */
export const maps: RawMapMetadata[] = Object.entries(mapsInfo).map(
  ([key, metadata]) =>
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    ({ ...metadata, key } as RawMapMetadata),
);

/** All maps indexed by map key */
export const mapsLookup = keyBy((m: RawMapMetadata) => m.key)(maps);
