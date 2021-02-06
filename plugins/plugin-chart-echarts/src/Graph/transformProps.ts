import {
  CategoricalColorNamespace,
  ChartProps,
  getMetricLabel,
  DataRecord,
} from '@superset-ui/core';
import { EChartsOption, GraphSeriesOption } from 'echarts';
import { GraphNodeItemOption } from 'echarts/types/src/chart/graph/GraphSeries';
import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { GraphConstants, tooltipConfig, normalizationLimits } from './constants';
import { EchartsProps } from '../types';
import { getChartPadding, getLegendProps } from '../utils/series';

/* eslint-disable no-param-reassign */
function setLabelVisibility(nodes: GraphNodeItemOption[], showSymbolThreshold: number) {
  if (showSymbolThreshold > 0) {
    nodes.forEach(function (node) {
      node.label = {
        show: node.value! > showSymbolThreshold,
      };
    });
  }
}

/* eslint-disable no-param-reassign */
function setNormalizedSymbolSize(nodes: GraphNodeItemOption[]) {
  let minValue: any = Number.MAX_VALUE;
  let maxValue: any = Number.MIN_VALUE;
  nodes.forEach(node => {
    if (node.symbolSize! > maxValue) {
      maxValue = node.symbolSize;
    }
    if (node.symbolSize! < minValue) {
      minValue = node.symbolSize;
    }
  });
  nodes.forEach(node => {
    node.symbolSize =
      // @ts-ignore: symbolsize is not null
      ((node.symbolSize - minValue) / (maxValue - minValue)) *
        normalizationLimits.nodeSizeRightLimit || 0 + normalizationLimits.nodeSizeLeftLimit;
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
    const nodeSource: any = link[source];
    const nodeTarget: any = link[target];
    const nodeCategory: string =
      category && link[category] ? link[category]!.toString() : 'default';
    const nodeValue: any = link[metricLabel];
    if (nodeValue) {
      if (!(nodeSource in nodes)) {
        echartNodes.push({
          id: index.toString(),
          name: nodeSource,
          value: nodeValue,
          symbolSize: nodeValue,
          category: nodeCategory,
        });
        sourceIndex = index;
        nodes[nodeSource] = index;
        index += 1;
      } else {
        sourceIndex = nodes[nodeSource];
        echartNodes[sourceIndex].value += nodeValue;
        echartNodes[sourceIndex].symbolSize += nodeValue;
      }

      if (!(nodeTarget in nodes)) {
        echartNodes.push({
          id: index.toString(),
          name: nodeTarget,
          value: nodeValue,
          symbolSize: nodeValue,
          category: nodeCategory,
        });
        targetIndex = index;
        nodes[nodeTarget] = index;
        index += 1;
      } else {
        targetIndex = nodes[nodeTarget];
        echartNodes[targetIndex].value += nodeValue;
        echartNodes[targetIndex].symbolSize += nodeValue;
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
      zoom: GraphConstants.zoom,
      type: 'graph',
      categories: echartCategories.map(c => ({ name: c, itemStyle: { color: colorFn(c) } })),
      layout,
      force: { ...GraphConstants.force, edgeLength, gravity, repulsion, friction },
      circular: GraphConstants.circular,
      data: echartNodes,
      links: echartLinks,
      roam,
      draggable,
      edgeSymbol: GraphConstants.edgeSymbol,
      edgeSymbolSize: GraphConstants.edgeSymbolSize,
      selectedMode,
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      animation: GraphConstants.animation,
      label: GraphConstants.label,
      lineStyle: GraphConstants.lineStyle,
      emphasis: GraphConstants.emphasis,
    },
  ];

  const echartOptions: EChartsOption = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: GraphConstants.animationDuration,
    animationEasing: GraphConstants.animationEasing,
    tooltip: tooltipConfig,
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
