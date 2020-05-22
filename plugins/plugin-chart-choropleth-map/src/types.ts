import type Projection from './chart/Projection';

export interface RawMapMetadata {
  key: string;
  name: string;
  url: string;
  keyField: string;
  type?: 'topojson' | 'geojson';
  projection?: Projection;
  rotate?: [number, number] | [number, number, number];
}
