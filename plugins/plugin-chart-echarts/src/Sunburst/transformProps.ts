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
import { ChartProps, DataRecord } from '@superset-ui/core';
import { EChartsOption, SunburstSeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { EchartsProps } from '../types';
import {
  EchartsSunburstFormData,
  DEFAULT_FORM_DATA as DEFAULT_SUNBURST_FORM_DATA,
  EchartsSunburstLabelType,
  Node,
} from './types';
import { sanitizeHtml } from '../utils/series';

export function buildHierarchy(rows: DataRecord[], groupby: string[], primaryMetric: string) {
  // Modified from legacy plugin code.
  const root = {
    name: 'root',
    children: [],
  };
  rows.forEach(row => {
    const levels = groupby;
    const nodeValue = row[primaryMetric];

    let currentNode: Node = root;
    for (let level = 0; level < levels.length; level += 1) {
      const children: Node[] = currentNode.children || [];
      const nodeName = row[levels[level]] ? row[levels[level]]!.toString() : '';

      const isLeafNode = level >= levels.length - 1;
      let childNode: Node | undefined;

      if (!isLeafNode) {
        childNode = children.find((child: any) => child.name === nodeName && child.level === level);

        if (!childNode) {
          childNode = {
            name: nodeName,
            children: [],
            level,
          };
          children.push(childNode);
        }
        currentNode = childNode;
      } else {
        childNode = {
          name: nodeName,
          value: nodeValue as number,
          children: [],
        };
        children.push(childNode);
      }
    }
  });

  return root.children;
}

export function formatLabel({
  params,
  labelType,
  sanitizeName = false,
}: {
  params: Pick<CallbackDataParams, 'name' | 'value'>;
  labelType: EchartsSunburstLabelType;
  sanitizeName: boolean;
}): string {
  const { name: rowName = '', value } = params;
  const name = sanitizeName ? sanitizeHtml(rowName) : rowName;

  switch (labelType) {
    case EchartsSunburstLabelType.Key:
      return name;
    case EchartsSunburstLabelType.Value:
      return value.toString();
    case EchartsSunburstLabelType.KeyValue:
      return `${name} - ${value}`;
    default:
      return name;
  }
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const {
    innerRadius,
    outerRadius,
    rotateLabel,
    labelMinAngle,
    showLabel,
    labelPosition,
    // labelDistance,
    labelType,
    metric,
  }: EchartsSunburstFormData = { ...DEFAULT_SUNBURST_FORM_DATA, ...formData };

  const data: DataRecord[] = queriesData[0].data || [];
  const primaryMetric = metric.label || metric;
  const sunburstData = buildHierarchy(data, formData.groupby, primaryMetric);

  const series: SunburstSeriesOption = {
    data: sunburstData,
    type: 'sunburst',
    radius: [innerRadius, outerRadius],
    itemStyle: {},
    label: {
      rotate: rotateLabel,
      minAngle: labelMinAngle,
      show: showLabel,
      position: labelPosition,
      // distance: labelDistance,
      formatter: (params: any) => formatLabel({ params, labelType, sanitizeName: true }),
    },
  };

  const echartOptions: EChartsOption = {
    series,
  };
  return { height, width, echartOptions };
}
