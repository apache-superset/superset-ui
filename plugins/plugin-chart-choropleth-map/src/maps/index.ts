import { keyBy } from 'lodash/fp';
import { RawMapMetadata } from '../types';

const maps: RawMapMetadata[] = [
  {
    key: 'usa',
    name: 'USA',
    type: 'topojson',
    // @ts-ignore
    load: () => import('./usa-topo.json'),
    keyField: 'properties.STATE',
    projection: 'Albers',
  },
  {
    key: 'world',
    name: 'World Map',
    type: 'topojson',
    // @ts-ignore
    load: () => import('./world-topo.json'),
    keyField: 'id',
    projection: 'Equirectangular',
    rotate: [-9, 0, 0],
  },
];

const mapsLookup: Record<string, RawMapMetadata> = keyBy((map: RawMapMetadata) => map.key)(maps);

export { mapsLookup, maps };
