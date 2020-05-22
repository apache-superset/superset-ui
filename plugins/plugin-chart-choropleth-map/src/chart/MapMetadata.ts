// eslint-disable-next-line import/no-unresolved
import type { Topology } from 'topojson-specification';
import type { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { get } from 'lodash/fp';
import { json } from 'd3-fetch';
import { RawMapMetadata } from '../types';
import Projection from './Projection';

export default class MapMetadata {
  key: string;

  name: string;

  url: string;

  type: 'topojson' | 'geojson';

  projection: Projection;

  rotate?: [number, number] | [number, number, number];

  keyField: string;

  keyAccessor: (...args: unknown[]) => string;

  constructor(metadata: RawMapMetadata) {
    const { type = 'topojson', keyField, url, key, name, projection = 'Albers', rotate } = metadata;

    this.key = key;
    this.keyField = keyField;
    this.type = type;
    this.url = url;
    this.name = name;
    this.projection = projection;
    this.rotate = rotate;
    const keyAccessor = get(keyField);
    this.keyAccessor = keyAccessor;
  }

  loadMap(): Promise<FeatureCollection> {
    return this.type === 'topojson'
      ? json<Topology>(this.url).then(
          map => feature(map, map.objects[this.key]) as FeatureCollection,
        )
      : json<FeatureCollection>(this.url);
  }

  createProjection() {
    const projection = Projection[this.projection]();
    if (this.rotate) {
      projection.rotate(this.rotate);
    }

    return projection;
  }
}
