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
import { AnnotationLayer, QueryFormData, TimeGranularity } from '@superset-ui/core';
import { DEFAULT_LEGEND_FORM_DATA, EchartsLegendFormData } from '../types';
import { EchartsTimeseriesContributionType } from '../Timeseries/types';

export enum EchartsTimeseriesSeriesType {
  Line = 'line',
  Scatter = 'scatter',
  Smooth = 'smooth',
  Bar = 'bar',
  Start = 'start',
  Middle = 'middle',
  End = 'end',
}

export type EchartsMixedTimeseriesFormData = {
  annotationLayers: AnnotationLayer[];
  area: boolean;
  areaB: boolean;
  colorScheme?: string;
  contributionMode?: EchartsTimeseriesContributionType;
  contributionModeB?: EchartsTimeseriesContributionType;
  logAxis: boolean;
  logAxisSecondary: boolean;
  markerEnabled: boolean;
  markerEnabledB: boolean;
  markerSize: number;
  markerSizeB: number;
  minorSplitLine: boolean;
  opacity: number;
  opacityB: number;
  orderDesc: boolean;
  rowLimit: number;
  rowLimitB: number;
  seriesType: EchartsTimeseriesSeriesType;
  seriesTypeB: EchartsTimeseriesSeriesType;
  stack: boolean;
  stackB: boolean;
  truncateYAxis: boolean;
  truncateYAxisB: boolean;
  yAxisFormat?: string;
  yAxisFormatSecondary?: string;
  yAxisIndex?: number;
  yAxisIndexB?: number;
  yAxisTitle?: string;
  yAxisTitleSecondary?: string;
  xAxisShowMinLabel?: boolean;
  xAxisShowMaxLabel?: boolean;
  xAxisTimeFormat?: string;
  timeGrainSqla?: TimeGranularity;
  yAxisBounds: [number | undefined | null, number | undefined | null];
  zoomable: boolean;
  richTooltip: boolean;
  xAxisLabelRotation: number;
} & EchartsLegendFormData;

export const DEFAULT_FORM_DATA: EchartsMixedTimeseriesFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  annotationLayers: [],
  area: false,
  areaB: false,
  logAxis: false,
  logAxisSecondary: false,
  markerEnabled: false,
  markerEnabledB: false,
  markerSize: 6,
  markerSizeB: 6,
  minorSplitLine: false,
  opacity: 0.2,
  orderDesc: true,
  rowLimit: 10000,
  seriesType: EchartsTimeseriesSeriesType.Line,
  stack: false,
  truncateYAxis: true,
  yAxisBounds: [null, null],
  yAxisIndex: 0,
  xAxisShowMinLabel: true,
  xAxisShowMaxLabel: true,
  zoomable: false,
  richTooltip: true,
  xAxisLabelRotation: 45,
};
