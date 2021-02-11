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
import { GraphSeriesOption, TooltipComponentOption } from 'echarts';

export const DEFAULT_GRAPH_SERIES_OPTION: GraphSeriesOption = {
  zoom: 1,
  circular: { rotateLabel: true },
  force: {
    initLayout: 'circular',
    layoutAnimation: true,
  },
  edgeSymbol: ['circle', 'arrow'],
  edgeSymbolSize: [10, 10],
  label: {
    show: true,
    position: 'right',
    distance: 5,
    rotate: 0,
    offset: [0, 0],
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 12,
    padding: [0, 0, 0, 0],
    overflow: 'truncate',
    formatter: '{b}',
  },
  emphasis: {
    focus: 'adjacency',
    lineStyle: {
      width: 10,
    },
  },
  animation: true,
  animationDuration: 500,
  animationEasing: 'cubicOut',
  lineStyle: { color: 'source', curveness: 0.1 },
};

export const tooltip: TooltipComponentOption = {
  show: true,
  // show node_name and node_value
  // Ref: https://echarts.apache.org/en/option.html#tooltip.formatter
  formatter: '{b}: {c}',
};

export const normalizationLimits = {
  nodeSizeLeftLimit: 10,
  nodeSizeRightLimit: 60,
};
