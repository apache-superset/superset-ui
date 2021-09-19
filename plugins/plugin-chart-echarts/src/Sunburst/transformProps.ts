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
  CategoricalColorNamespace,
  ChartProps,
  getMetricLabel,
  DataRecord,
  DataRecordValue,
} from '@superset-ui/core';
import { EChartsOption, GraphSeriesOption, SunburstSeriesOption } from 'echarts';
import { extent as d3Extent } from 'd3-array';
import { GraphEdgeItemOption } from 'echarts/types/src/chart/graph/GraphSeries';
import {
  EchartsGraphFormData,
  EChartGraphNode,
  DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA,
  EdgeSymbol,
} from './types';
import { DEFAULT_GRAPH_SERIES_OPTION } from './constants';
import { EchartsProps } from '../types';
import { getChartPadding, getLegendProps, sanitizeHtml } from '../utils/series';
import { EChartsOption } from 'echarts';

function buildHierarchy(rows: DataRecord[], groupby: string[], primaryMetric: string) {
  // Modified from legacy pllugin code.
  const root = {
    name: 'root',
    children: [],
  };
  rows.forEach(row => {
    //rows.forEach((row: any) => {
    const levels = groupby;
    const nodeValue = row[primaryMetric];

    let currentNode = root;
    for (let level = 0; level < levels.length; level += 1) {
      const children: any = currentNode.children || [];
      const nodeName = row[levels[level]].toString();

      const isLeafNode = level >= levels.length - 1;
      let childNode: any;

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
          value: nodeValue,
          children: [],
        };
        children.push(childNode);
      }
    }
  });

  return root.children;
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];
  const primaryMetric = formData.metric.label || formData.metric;
  const secondaryMetric = formData.secondaryMetric;

  const sunburstData = buildHierarchy(data, formData.groupby, primaryMetric);

  const series: SunburstSeriesOption = {
    data: sunburstData,
    type: 'sunburst',
  };

  const echartOptions: EChartsOption = {
    series,
  };
  return { height, width, echartOptions };
}
