/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import { geoPath } from 'd3-geo';
import type { FeatureCollection } from 'geojson';
import loadMap from './loadMap';
import MapMetadata from './MapMetadata';

export type ChoroplethMapProps = {
  height: number;
  width: number;
  map: string;
  data: { x: number; y: number }[];
};

export default class ChoroplethMap extends React.PureComponent<
  ChoroplethMapProps,
  {
    mapData?: {
      metadata: MapMetadata;
      object: FeatureCollection;
    };
  }
> {
  constructor(props: ChoroplethMapProps) {
    super(props);

    this.state = {
      mapData: undefined,
    };
  }

  componentDidMount() {
    const { map } = this.props;
    loadMap(map).then(mapData => {
      this.setState({ mapData });
    });
  }

  renderMap() {
    const { height, width } = this.props;
    const { mapData } = this.state;

    if (typeof mapData !== 'undefined') {
      const { metadata, object } = mapData;
      const { keyAccessor } = metadata;
      const projection = metadata.createProjection().fitSize([width, height], object);
      const path = geoPath().projection(projection);

      return object.features.map(f => (
        <path
          key={keyAccessor(f)}
          d={path(f) || ''}
          onClick={() => {
            console.log(f);
          }}
        />
      ));
    }

    return null;
  }

  render() {
    const { height, width } = this.props;

    return (
      <svg
        width={width}
        height={height}
        style={{ backgroundColor: '#ffe459', padding: 16, height, width }}
      >
        {this.renderMap()}
      </svg>
    );
  }
}
