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
export type EchartsGraphFormData = {
  name: string;
  source?: string;
  target?: string;
  category?: string;
  colorScheme?: string;
  metric?: string;
  layout: string;
  roam: boolean;
  draggable: boolean;
  selectedMode: string;
  showSymbolThreshold: number;
};

export const DEFAULT_FORM_DATA: EchartsGraphFormData = {
  name: 'graph chart',
  layout: 'circular',
  roam: true,
  draggable: false,
  selectedMode: 'single',
  showSymbolThreshold: 0,
};

export const GraphConstants = {
  zoom: 1,
  circularConfig: { rotateLabel: true },
  forceConfig: {
    initLayout: 'circular',
    repulsion: 100,
    gravity: 0.3,
    edgeLength: 400,
    layoutAnimation: true,
    friction: 0.2,
  },
  edgeSymbol: ['circle', 'arrow'],
  edgeSymbolSize: [10, 10],
  labelConfig: {
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
    overflow: 'none',
    formatter: '{b}',
  },
  emphasis: {
    focus: 'adjacency',
    lineStyle: {
      width: 10,
    },
  },
  autoCurveness: 20,
  left: 'center',
  top: 'middle',
  right: 'auto',
  bottom: 'auto',
  animation: true,
  animationDuration: 500,
  animationEasing: 'cubicOut',
  tooltipConfiguration: { show: true, formatter: '{b}: {c}' },
  lineStyleConfiguration: { color: 'source', curveness: 0.1 },
};
