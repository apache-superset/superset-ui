/* eslint-disable react/sort-prop-types */
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
import PropTypes from 'prop-types';
import {
  annotationLayerType,
  boxPlotValueType,
  bulletDataType,
  categoryAndValueXYType,
  rgbObjectType,
  numericXYType,
  numberOrAutoType,
  stringOrObjectWithLabelType,
} from './PropTypes';
import { getOverlappingElements } from './utils/overlap';
import { drawGraph } from './utils/drawGraph';

const propTypes = {
  data: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        // pie
        categoryAndValueXYType,
        // dist-bar
        PropTypes.shape({
          key: PropTypes.string,
          values: PropTypes.arrayOf(categoryAndValueXYType),
        }),
        // area, line, compare, bar
        PropTypes.shape({
          key: PropTypes.arrayOf(PropTypes.string),
          values: PropTypes.arrayOf(numericXYType),
        }),
        // dual-line
        PropTypes.shape({
          classed: PropTypes.string,
          key: PropTypes.string,
          type: PropTypes.string,
          values: PropTypes.arrayOf(numericXYType),
          yAxis: PropTypes.number,
        }),
        // box-plot
        PropTypes.shape({
          label: PropTypes.string,
          values: PropTypes.arrayOf(boxPlotValueType),
        }),
        // bubble
        PropTypes.shape({
          key: PropTypes.string,
          values: PropTypes.arrayOf(PropTypes.object),
        }),
      ]),
    ),
    // bullet
    bulletDataType,
  ]),
  width: PropTypes.number,
  height: PropTypes.number,
  annotationData: PropTypes.object,
  annotationLayers: PropTypes.arrayOf(annotationLayerType),
  bottomMargin: numberOrAutoType,
  colorScheme: PropTypes.string,
  comparisonType: PropTypes.string,
  contribution: PropTypes.bool,
  leftMargin: numberOrAutoType,
  onError: PropTypes.func,
  showLegend: PropTypes.bool,
  showMarkers: PropTypes.bool,
  useRichTooltip: PropTypes.bool,
  vizType: PropTypes.oneOf([
    'area',
    'bar',
    'box_plot',
    'bubble',
    'bullet',
    'compare',
    'column',
    'dist_bar',
    'line',
    'line_multi',
    'time_pivot',
    'pie',
    'dual_line',
  ]),
  xAxisFormat: PropTypes.string,
  numberFormat: PropTypes.string,
  xAxisLabel: PropTypes.string,
  xAxisShowMinMax: PropTypes.bool,
  xIsLogScale: PropTypes.bool,
  xTicksLayout: PropTypes.oneOf(['auto', 'staggered', '45°']),
  yAxisFormat: PropTypes.string,
  yAxisBounds: PropTypes.arrayOf(PropTypes.number),
  yAxisLabel: PropTypes.string,
  yAxisShowMinMax: PropTypes.bool,
  yIsLogScale: PropTypes.bool,
  // 'dist-bar' only
  orderBars: PropTypes.bool,
  // 'bar' or 'dist-bar'
  isBarStacked: PropTypes.bool,
  showBarValue: PropTypes.bool,
  // 'bar', 'dist-bar' or 'column'
  reduceXTicks: PropTypes.bool,
  // 'bar', 'dist-bar' or 'area'
  showControls: PropTypes.bool,
  // 'line' only
  showBrush: PropTypes.oneOf([true, 'yes', false, 'no', 'auto']),
  onBrushEnd: PropTypes.func,
  // 'line-multi' or 'dual-line'
  yAxis2Format: PropTypes.string,
  // 'line', 'time-pivot', 'dual-line' or 'line-multi'
  lineInterpolation: PropTypes.string,
  // 'pie' only
  isDonut: PropTypes.bool,
  isPieLabelOutside: PropTypes.bool,
  pieLabelType: PropTypes.oneOf([
    'key',
    'value',
    'percent',
    'key_value',
    'key_percent',
    'key_value_percent',
  ]),
  showLabels: PropTypes.bool,
  // 'area' only
  areaStackedStyle: PropTypes.string,
  // 'bubble' only
  entity: PropTypes.string,
  maxBubbleSize: PropTypes.number,
  xField: stringOrObjectWithLabelType,
  yField: stringOrObjectWithLabelType,
  sizeField: stringOrObjectWithLabelType,
  // time-pivot only
  baseColor: rgbObjectType,
};

function nvd3Vis(element, props) {
  const onComplete = d3Element => {
    const xTicks = d3Element.select('.nv-x.nv-axis').selectAll('.tick');
    const overlapLabels = getOverlappingElements(xTicks[0] ?? [], 0, 0);

    const isLegendOverlap = () => {
      const legend = d3Element.select('.nv-legend')[0][0] ?? null;
      const focus = d3Element.select('.nv-axis.nvd3-svg')[0][0] ?? null;
      const el = [legend, focus].filter(data => data);
      const overlapLegend = getOverlappingElements(el, 0, 0);

      return overlapLegend.length > 0;
    };

    const showXAxis = function () {
      const label1 = overlapLabels[0] ? overlapLabels[0].getBoundingClientRect() : null;
      const label2 = overlapLabels[1] ? overlapLabels[1].getBoundingClientRect() : null;

      if (!label1 || !label2) {
        return true;
      }

      const { x: x1 } = label1;
      const { x: x2 } = label2;

      if (x1 > x2) {
        return x1 - x2 > 40;
      }

      if (x1 < x2) {
        return x2 - x1 > 40;
      }

      return true;
    };

    drawGraph(element, {
      ...props,
      showLegend: !isLegendOverlap(),
      xTicksLayout: overlapLabels.length ? '45°' : props.xTicksLayout,
      showXAxis: showXAxis(),
    });
  };

  drawGraph(element, { ...props, showXAxis: true }, onComplete);
}

nvd3Vis.displayName = 'NVD3';
nvd3Vis.propTypes = propTypes;
export default nvd3Vis;
