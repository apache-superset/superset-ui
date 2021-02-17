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
import { max as d3Max, min as d3Min } from 'd3-array';
import { GraphEdgeItemOption } from 'echarts/types/src/chart/graph/GraphSeries';
import {
  EchartsGraphFormData,
  EChartGraphNode,
  DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA,
} from './types';
import { DEFAULT_GRAPH_SERIES_OPTION, normalizationLimits, edgeWidth } from './constants';
import { EchartsProps } from '../types';
import { getChartPadding, getLegendProps } from '../utils/series';

/* eslint-disable no-param-reassign */
function setLabelVisibility(nodes: EChartGraphNode[], showSymbolThreshold: number): void {
  if (showSymbolThreshold > 0) {
    nodes.forEach(function (node) {
      node.label = {
        show: node.value > showSymbolThreshold,
      };
    });
  }
}

/* eslint-disable no-param-reassign */
function setNormalizedSymbolSize(nodes: EChartGraphNode[], nodeValues: number[]): void {
  const minValue = d3Min(nodeValues) as number;
  const maxValue = d3Max(nodeValues) as number;

  let i = 0;
  nodes.forEach(node => {
    node.symbolSize =
      (((nodeValues[i] - minValue) / (maxValue - minValue)) *
        normalizationLimits.nodeSizeRightLimit || 0) + normalizationLimits.nodeSizeLeftLimit;
    i += 1;
  });
}

function getKeyByValue(object: { [name: string]: number }, value: number): string {
  return Object.keys(object).find(key => object[key] === value) as string;
}

function edgeFormatter(
  sourceIndex: string,
  targetIndex: string,
  value: number,
  nodes: { [name: string]: number },
): string {
  const source = Number(sourceIndex);
  const target = Number(targetIndex);
  return `${getKeyByValue(nodes, source)} > ${getKeyByValue(nodes, target)} : ${value}`;
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
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
  const echartNodes: EChartGraphNode[] = [];
  const echartLinks: GraphEdgeItemOption[] = [];
  const echartCategories: string[] = [];
  const nodeValues: number[] = [];
  let index = 0;
  let sourceIndex = 0;
  let targetIndex = 0;

  data.forEach(link => {
    const nodeSource = link[source] as string;
    const nodeTarget = link[target] as string;
    const nodeCategory: string =
      category && link[category] ? link[category]!.toString() : 'default';

    const nodeValue = link[metricLabel] as number;

    if (nodeValue) {
      if (nodeSource in nodes) {
        sourceIndex = nodes[nodeSource];
        nodeValues[sourceIndex] += nodeValue;
        echartNodes[sourceIndex].value += nodeValue;
      } else {
        echartNodes.push({
          id: index.toString(),
          name: nodeSource,
          value: nodeValue,
          category: nodeCategory,
          select: DEFAULT_GRAPH_SERIES_OPTION.select,
          tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
        });
        nodeValues[index] = nodeValue;
        nodes[nodeSource] = index;
        sourceIndex = index;
        index += 1;
      }

      if (nodeTarget in nodes) {
        targetIndex = nodes[nodeTarget];
        nodeValues[targetIndex] += nodeValue;
        echartNodes[targetIndex].value += nodeValue;
      } else {
        echartNodes.push({
          id: index.toString(),
          name: nodeTarget,
          value: nodeValue,
          category: nodeCategory,
          select: DEFAULT_GRAPH_SERIES_OPTION.select,
          tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
        });
        nodeValues[index] = nodeValue;
        nodes[nodeTarget] = index;
        targetIndex = index;
        index += 1;
      }
      echartLinks.push({
        source: sourceIndex.toString(),
        target: targetIndex.toString(),
        value: nodeValue,
        lineStyle: { width: edgeWidth },
      });

      if (!echartCategories.includes(nodeCategory)) {
        echartCategories.push(nodeCategory);
      }
    }
  });

  setLabelVisibility(echartNodes, showSymbolThreshold);
  setNormalizedSymbolSize(echartNodes, nodeValues);

  const series: GraphSeriesOption[] = [
    {
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
    animationDuration: DEFAULT_GRAPH_SERIES_OPTION.animationDuration,
    animationEasing: DEFAULT_GRAPH_SERIES_OPTION.animationEasing,
    tooltip: {
      formatter: (params: any): string =>
        edgeFormatter(params.data.source, params.data.target, params.value, nodes),
    },
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
