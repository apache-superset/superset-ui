/* eslint-disable import/no-webpack-loader-syntax, import/no-unresolved */
import { keyBy } from 'lodash/fp';
// @ts-ignore
import usa from 'file-loader!./usa.topojson';
// @ts-ignore
import world from 'file-loader!./world.topojson';
import { RawMapMetadata } from '../types';

const maps: RawMapMetadata[] = [
  {
    key: 'usa',
    name: 'USA',
    type: 'topojson',
    url: usa,
    keyField: 'properties.STATE',
    projection: 'Albers',
  },
  {
    key: 'world',
    name: 'World Map',
    type: 'topojson',
    url: world,
    keyField: 'id',
    projection: 'Equirectangular',
    rotate: [-9, 0, 0],
  },
];

const mapsLookup: Record<string, RawMapMetadata> = keyBy((map: RawMapMetadata) => map.key)(maps);

export { mapsLookup, maps };
