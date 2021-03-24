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
import { ChartProps, getMetricLabel, DataRecord } from '@superset-ui/core';
import { EChartsOption, TreeSeriesOption } from 'echarts';
import { TreeSeriesNodeItemOption } from 'echarts/types/src/chart/tree/TreeSeries';
import { EchartsTreeFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { DEFAULT_TREE_SERIES_OPTION, tooltip } from './constants';
import { EchartsProps } from '../types';
import { OptionDataValue, OptionName } from 'echarts/types/src/util/types';

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    id,
    relation,
    name,
    rootNode,
    metric = '',
    layout,
    orient,
    symbol,
    symbolSize,
    roam,
  }: EchartsTreeFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };

  const metricLabel = getMetricLabel(metric);
  const tree: TreeSeriesNodeItemOption = { name: rootNode, children: [] };
  const indexMap: { [name: string]: number } = {};
  let rootNodeId: null | string = null;
  for (let i = 0; i < data.length; i++) {
    const nodeId = data[i][id] as string;
    indexMap[nodeId] = i;
    data[i].children = [] as any;
    if (data[i][name] == rootNode) {
      rootNodeId = nodeId;
    }
  }

  function getNode(
    name: OptionName,
    children: TreeSeriesNodeItemOption[],
    value: OptionDataValue,
  ): TreeSeriesNodeItemOption {
    return { name, children, value };
  }
  if (rootNodeId) {
    data.forEach(node => {
      if (node[relation] === rootNodeId) {
        tree.children!.push(
          getNode(
            node[name] as OptionName,
            node.children as any,
            node[metricLabel] as OptionDataValue,
          ),
        );
      } else {
        const parentId = node[relation] as string;
        if (data[indexMap[parentId]]) {
          //Check if parent exists,and child is not dangling due to bad/row-limited data
          const parentIndex: number = indexMap[parentId];

          data[parentIndex].children!.push(
            getNode(
              node[name] as OptionName,
              node.children as any,
              node[metricLabel] as OptionDataValue,
            ),
          );
        }
      }
    });
  }
  const series: TreeSeriesOption[] = [
    {
      type: 'tree',
      data: [tree],
      label: DEFAULT_TREE_SERIES_OPTION.label,
      emphasis: DEFAULT_TREE_SERIES_OPTION.emphasis,
      animation: DEFAULT_TREE_SERIES_OPTION.animation,
      layout,
      orient,
      symbol,
      roam,
      symbolSize,
      lineStyle: DEFAULT_TREE_SERIES_OPTION.lineStyle,
      select: DEFAULT_TREE_SERIES_OPTION.select,
    },
  ];

  const echartOptions: EChartsOption = {
    animationDuration: DEFAULT_TREE_SERIES_OPTION.animationDuration,
    animationEasing: DEFAULT_TREE_SERIES_OPTION.animationEasing,
    series,
    tooltip,
  };

  return {
    width,
    height,
    echartOptions,
  };
}
