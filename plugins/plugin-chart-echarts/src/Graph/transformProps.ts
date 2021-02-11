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
} from '@superset-ui/core';
import { EChartsOption, GraphSeriesOption } from 'echarts';
import { GraphNodeItemOption } from 'echarts/types/src/chart/graph/GraphSeries';
import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { DEFAULT_GRAPH_SERIES_OPTION, tooltip, normalizationLimits } from './constants';
import { EchartsProps } from '../types';
import { getChartPadding, getLegendProps } from '../utils/series';

/* eslint-disable no-param-reassign */
function setLabelVisibility(nodes: GraphNodeItemOption[], showSymbolThreshold: number): void {
  if (showSymbolThreshold > 0) {
    nodes.forEach(function (node) {
      node.label = {
        show: node.value! > showSymbolThreshold,
      };
    });
  }
}

/* eslint-disable no-param-reassign */
function setNormalizedSymbolSize(nodes: GraphNodeItemOption[]): void {
  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;
  nodes.forEach(node => {
    if (node.value == null) {
      return;
    }

    if (node.value > maxValue) {
      maxValue = node.value as any;
    }
    if (node.value < minValue) {
      minValue = node.value as any;
    }
  });
  nodes.forEach(node => {
    node.symbolSize =
      // @ts-ignore: value is not null and type is GraphDataValue
      (((node.value - minValue) / (maxValue - minValue)) * normalizationLimits.nodeSizeRightLimit ||
        0) + normalizationLimits.nodeSizeLeftLimit;
  });
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    name,
    source,
    target,
    category,
    colorScheme,
    metric = '',
    layout,
    roam,
    draggable,
    selectedMode,
    showSymbolThreshold,
    edgeLength,
    gravity,
    repulsion,
    friction,
    legendMargin,
    legendOrientation,
    legendType,
    showLegend,
  }: EchartsGraphFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };

  const metricLabel = getMetricLabel(metric);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const nodes: { [name: string]: number } = {};
  const echartNodes: GraphNodeItemOption[] = [];
  const echartLinks: { source: string; target: string }[] = [];
  const echartCategories: string[] = [];
  let index = 0;
  let sourceIndex = 0;
  let targetIndex = 0;

  data.forEach(link => {
    const nodeSource = link[source] as string;
    const nodeTarget = link[target] as string;
    const nodeCategory: string =
      category && link[category] ? link[category]!.toString() : 'default';
    const nodeValue = link[metricLabel] as any;
    if (nodeValue) {
      if (nodeSource in nodes) {
        sourceIndex = nodes[nodeSource];
        echartNodes[sourceIndex].value! += nodeValue;
      } else {
        echartNodes.push({
          id: index.toString(),
          name: nodeSource,
          value: nodeValue,
          category: nodeCategory,
        });
        sourceIndex = index;
        nodes[nodeSource] = index;
        index += 1;
      }

      if (nodeTarget in nodes) {
        targetIndex = nodes[nodeTarget];
        echartNodes[targetIndex].value! += nodeValue;
      } else {
        echartNodes.push({
          id: index.toString(),
          name: nodeTarget,
          value: nodeValue,
          category: nodeCategory,
        });
        targetIndex = index;
        nodes[nodeTarget] = index;
        index += 1;
      }
      echartLinks.push({ source: sourceIndex.toString(), target: targetIndex.toString() });

      if (!echartCategories.includes(nodeCategory)) {
        echartCategories.push(nodeCategory);
      }
    }
  });

  setLabelVisibility(echartNodes, showSymbolThreshold);
  setNormalizedSymbolSize(echartNodes);

  const series: GraphSeriesOption[] = [
    {
      name,
      zoom: DEFAULT_GRAPH_SERIES_OPTION.zoom,
      type: 'graph',
      categories: echartCategories.map(c => ({ name: c, itemStyle: { color: colorFn(c) } })),
      layout,
      force: { ...DEFAULT_GRAPH_SERIES_OPTION.force, edgeLength, gravity, repulsion, friction },
      circular: DEFAULT_GRAPH_SERIES_OPTION.circular,
      data: echartNodes,
      links: echartLinks,
      roam,
      draggable,
      edgeSymbol: DEFAULT_GRAPH_SERIES_OPTION.edgeSymbol,
      edgeSymbolSize: DEFAULT_GRAPH_SERIES_OPTION.edgeSymbolSize,
      selectedMode,
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      animation: DEFAULT_GRAPH_SERIES_OPTION.animation,
      label: DEFAULT_GRAPH_SERIES_OPTION.label,
      lineStyle: DEFAULT_GRAPH_SERIES_OPTION.lineStyle,
      emphasis: DEFAULT_GRAPH_SERIES_OPTION.emphasis,
    },
  ];

  const echartOptions: EChartsOption = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: DEFAULT_GRAPH_SERIES_OPTION.animationDuration,
    animationEasing: DEFAULT_GRAPH_SERIES_OPTION.animationEasing,
    tooltip,
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: echartCategories,
    },
    series,
  };
  return {
    width,
    height,
    echartOptions,
  };
}
