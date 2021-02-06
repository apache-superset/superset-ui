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
import {
  DEFAULT_LEGEND_FORM_DATA,
  EchartsLegendFormData,
  LegendOrientation,
  LegendType,
} from '../types';

export type EchartsGraphFormData = EchartsLegendFormData & {
  name: string;
  source: string;
  target: string;
  category?: string;
  colorScheme?: string;
  metric?: string;
  layout: string;
  roam: boolean;
  draggable: boolean;
  selectedMode: string;
  showSymbolThreshold: number;
  repulsion: number;
  gravity: number;
  edgeLength: number;
  friction: number;
};

export const DEFAULT_FORM_DATA: EchartsGraphFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  name: 'graph chart',
  source: '',
  target: '',
  layout: 'force',
  roam: true,
  draggable: false,
  selectedMode: 'single',
  showSymbolThreshold: 0,
  repulsion: 1000,
  gravity: 0.3,
  edgeLength: 400,
  friction: 0.2,
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
};
