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
import { ChartDataResponseResult, ChartProps, QueryFormData } from '@superset-ui/core';
import { LabelPositionEnum } from '../types';

export type EchartsTreemapFormData = QueryFormData & {
  colorScheme?: string;
  groupby: string[];
  metric?: string;
  labelType: EchartsTreemapLabelType;
  labelPosition: LabelPositionEnum;
  showLabels: boolean;
  showUpperLabels: boolean;
  numberFormat: string;
  dateFormat: string;
  treemapRatio: number;
  showBreadcrumb: boolean;
  roam: boolean | 'scale' | 'move';
  nodeClick?: 'zoomToNode' | 'link';
};

export enum EchartsTreemapLabelType {
  Key = 'key',
  Value = 'value',
  KeyValue = 'key_value',
}

export interface EchartsTreemapChartProps extends ChartProps {
  formData: EchartsTreemapFormData;
  queriesData: ChartDataResponseResult[];
}

// @ts-ignore
export const DEFAULT_FORM_DATA: EchartsTreemapFormData = {
  groupby: [],
  labelType: EchartsTreemapLabelType.KeyValue,
  labelPosition: LabelPositionEnum.InsideTopLeft,
  numberFormat: 'SMART_NUMBER',
  showLabels: true,
  showUpperLabels: true,
  dateFormat: 'smart_date',
  treemapRatio: 0.5 * (1 + Math.sqrt(5)), // golden ratio
  showBreadcrumb: true,
  roam: true,
  nodeClick: 'zoomToNode',
};

export type TreemapNode = {
  name?: string;
  value?: number;
  children?: TreemapNode[];
  depth?: number;
};
