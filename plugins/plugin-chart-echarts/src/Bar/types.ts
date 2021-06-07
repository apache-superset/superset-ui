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
import { EChartsOption } from 'echarts';
import {
  QueryFormData,
  ChartDataResponseResult,
  ChartProps,
  DataRecordValue,
  QueryFormMetric,
  SetDataMaskHook,
} from '@superset-ui/core';
import {
  DEFAULT_LEGEND_FORM_DATA,
  EchartsLegendFormData,
  LegendOrientation,
  LegendType,
} from '../types';

export type EchartsBarFormData = QueryFormData &
  EchartsLegendFormData & {
    timeseries?: boolean;
    colorScheme?: string;
    groupby: string[];
    metrics: QueryFormMetric[];
    xAxisTimeFormat?: string;
    yAxisFormat?: string;
  };

export interface EchartsBarChartProps extends ChartProps {
  formData: EchartsBarFormData;
  queriesData: ChartDataResponseResult[];
}

export interface BarChartTransformedProps {
  height: number;
  width: number;
  echartOptions: EChartsOption;
  formData?: EchartsBarFormData;
  emitFilter?: boolean;
  setDataMask?: SetDataMaskHook;
  labelMap?: Record<string, DataRecordValue[]>;
  groupby?: string[];
  selectedValues?: Record<number, string>;
}

// @ts-ignore
export const DEFAULT_BAR_FORM_DATA: EchartsBarFormData = {
  ...DEFAULT_LEGEND_FORM_DATA,
  groupby: [],
  legendOrientation: LegendOrientation.Top,
  legendType: LegendType.Scroll,
  metrics: [],
};
