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
import { t } from '@superset-ui/translation';
import { Zoom } from '@vx/zoom';
import { localPoint } from '@vx/event';
import { RectClipPath } from '@vx/clip-path';
import { geoPath } from 'd3-geo';
import type { FeatureCollection } from 'geojson';
import loadMap from './loadMap';
import MapMetadata from './MapMetadata';
import {
  PADDING,
  RelativeDiv,
  IconButton,
  TextButton,
  ZoomControls,
  MiniMapControl,
} from './components';

const initialTransform = {
  scaleX: 1,
  scaleY: 1,
  translateX: 0,
  translateY: 0,
  skewX: 0,
  skewY: 0,
};

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
    showMiniMap: boolean;
  }
> {
  constructor(props: ChoroplethMapProps) {
    super(props);

    this.state = {
      mapData: undefined,
      showMiniMap: true,
    };
  }

  componentDidMount() {
    this.loadMap();
  }

  componentDidUpdate(prevProps: ChoroplethMapProps) {
    if (prevProps.map !== this.props.map) {
      this.loadMap();
    }
  }

  loadMap() {
    const { map } = this.props;
    this.setState({ mapData: undefined });
    loadMap(map).then(mapData => {
      this.setState({ mapData });
    });
  }

  toggleMiniMap = () => {
    const { showMiniMap } = this.state;
    this.setState({
      showMiniMap: !showMiniMap,
    });
  };

  renderMap() {
    const { height, width } = this.props;
    const { mapData } = this.state;

    if (typeof mapData !== 'undefined') {
      const { metadata, object } = mapData;
      const { keyAccessor } = metadata;
      const projection = metadata.createProjection().fitExtent(
        [
          [PADDING, PADDING],
          [width - PADDING * 2, height - PADDING * 2],
        ],
        object,
      );
      const path = geoPath().projection(projection);

      return object.features.map(f => (
        <path
          key={keyAccessor(f)}
          vectorEffect="non-scaling-stroke"
          stroke="#ccc"
          fill="#f0f0f0"
          d={path(f) || ''}
        />
      ));
    }

    return null;
  }

  render() {
    const { height, width } = this.props;
    const { showMiniMap } = this.state;

    const renderedMap = this.renderMap();
    const miniMapTransform = `translate(${(width * 3) / 4 - PADDING}, ${
      (height * 3) / 4 - PADDING
    }) scale(0.25)`;

    return (
      <Zoom
        style={{ width, height }}
        width={width}
        height={height}
        scaleXMin={0.75}
        scaleXMax={8}
        scaleYMin={0.75}
        scaleYMax={8}
        transformMatrix={initialTransform}
      >
        {zoom => (
          <RelativeDiv>
            <svg
              width={width}
              height={height}
              style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
            >
              <RectClipPath id="zoom-clip" width={width} height={height} />
              <g
                onWheel={zoom.handleWheel}
                // eslint-disable-next-line react/jsx-handler-names
                onMouseDown={zoom.dragStart}
                // eslint-disable-next-line react/jsx-handler-names
                onMouseMove={zoom.dragMove}
                // eslint-disable-next-line react/jsx-handler-names
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (!zoom.isDragging) return;
                  zoom.dragEnd();
                }}
                onDoubleClick={event => {
                  const point = localPoint(event) || undefined;
                  zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                }}
              >
                <rect width={width} height={height} fill="transparent" />
                <g transform={zoom.toString()}>{renderedMap}</g>
              </g>
              {showMiniMap && (
                <g clipPath="url(#zoom-clip)" transform={miniMapTransform}>
                  <rect width={width} height={height} fill="#fff" stroke="#999" />
                  {renderedMap}
                  <rect
                    width={width}
                    height={height}
                    fill="white"
                    fillOpacity={0.2}
                    stroke="#999"
                    strokeWidth={4}
                    transform={zoom.toStringInvert()}
                  />
                </g>
              )}
            </svg>
            <ZoomControls>
              <IconButton type="button" onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}>
                +
              </IconButton>
              <IconButton type="button" onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}>
                -
              </IconButton>
              <TextButton
                type="button"
                // eslint-disable-next-line react/jsx-handler-names
                onClick={zoom.clear}
              >
                Reset
              </TextButton>
            </ZoomControls>
            <MiniMapControl>
              <TextButton
                type="button"
                // eslint-disable-next-line react/jsx-handler-names
                onClick={this.toggleMiniMap}
              >
                {showMiniMap ? t('Hide Mini Map') : t('Show Mini Map')}
              </TextButton>
            </MiniMapControl>
          </RelativeDiv>
        )}
      </Zoom>
    );
  }
}
