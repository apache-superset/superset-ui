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
/* eslint-disable react/jsx-sort-default-props, react/sort-prop-types */
/* eslint-disable react/forbid-prop-types, react/require-default-props */
import React from 'react';
import PropTypes from 'prop-types';
import MapGL from 'react-map-gl';
import Immutable from 'immutable';
import ViewportMercator from 'viewport-mercator-project';
import ScatterPlotGlowOverlay from './ScatterPlotGlowOverlay';
import './MapBox.css';

const NOOP = () => {};
export const DEFAULT_MAX_ZOOM = 16;
export const DEFAULT_POINT_RADIUS = 60;

const propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  aggregatorName: PropTypes.string,
  clusterer: PropTypes.object,
  globalOpacity: PropTypes.number,
  hasCustomMetric: PropTypes.bool,
  mapStyle: PropTypes.string,
  mapboxApiKey: PropTypes.string.isRequired,
  onViewportChange: PropTypes.func,
  pointRadius: PropTypes.number,
  pointRadiusUnit: PropTypes.string,
  renderWhileDragging: PropTypes.bool,
  rgb: PropTypes.array,
  bounds: PropTypes.array,
};

const defaultProps = {
  width: 400,
  height: 400,
  globalOpacity: 1,
  onViewportChange: NOOP,
  pointRadius: DEFAULT_POINT_RADIUS,
  pointRadiusUnit: 'Pixels',
};

class MapBox extends React.Component {
  constructor(props) {
    super(props);

    const { width, height, bounds } = this.props;
    // Get a viewport that fits the given bounds, which all marks to be clustered.
    // Derive lat, lon and zoom from this viewport. This is only done on initial
    // render as the bounds don't update as we pan/zoom in the current design.
    const mercator = new ViewportMercator({
      width,
      height,
    }).fitBounds(bounds);
    const { latitude, longitude, zoom } = mercator;

    this.state = {
      viewport: {
        longitude,
        latitude,
        zoom,
      },
    };
    this.handleViewportChange = this.handleViewportChange.bind(this);
  }

  handleViewportChange(viewport) {
    this.setState({ viewport });
    const { onViewportChange } = this.props;
    onViewportChange(viewport);
  }

  render() {
    const {
      width,
      height,
      aggregatorName,
      clusterer,
      globalOpacity,
      mapStyle,
      mapboxApiKey,
      pointRadius,
      pointRadiusUnit,
      renderWhileDragging,
      rgb,
      hasCustomMetric,
    } = this.props;
    const { viewport } = this.state;
    const isDragging = viewport.isDragging === undefined ? false : viewport.isDragging;

    // Compute the clusters based only on the current viewport
    const zoomPower = 2 ** (viewport.zoom + 1);
    const halfHeight = height / zoomPower; // = height / 2 / (2 ** viewport.zoom)
    const halfWidth = width / zoomPower; // = width / 2 / (2 ** viewport.zoom)
    const bbox = [
      viewport.longitude - halfHeight,
      viewport.latitude - halfWidth,
      viewport.longitude + halfHeight,
      viewport.latitude + halfWidth,
    ];
    const clusters = clusterer.getClusters(bbox, Math.round(viewport.zoom));

    return (
      <MapGL
        {...viewport}
        mapStyle={mapStyle}
        width={width}
        height={height}
        mapboxApiAccessToken={mapboxApiKey}
        onViewportChange={this.handleViewportChange}
      >
        <ScatterPlotGlowOverlay
          {...viewport}
          isDragging={isDragging}
          locations={Immutable.fromJS(clusters)}
          dotRadius={pointRadius}
          pointRadiusUnit={pointRadiusUnit}
          rgb={rgb}
          globalOpacity={globalOpacity}
          compositeOperation="screen"
          renderWhileDragging={renderWhileDragging}
          aggregation={hasCustomMetric ? aggregatorName : null}
          lngLatAccessor={location => {
            const coordinates = location.get('geometry').get('coordinates');

            return [coordinates.get(0), coordinates.get(1)];
          }}
        />
      </MapGL>
    );
  }
}

MapBox.propTypes = propTypes;
MapBox.defaultProps = defaultProps;

export default MapBox;
