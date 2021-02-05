import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { GraphConstants } from './constants';
import {
  CategoricalColorNamespace,
  ChartProps,
  getMetricLabel,
  DataRecord,
  DataRecordValue,
} from '@superset-ui/core';
import { EchartsProps } from '../types';
import { getChartPadding, getLegendProps } from '../utils/series';

function setLabelVisibility(
  nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: any;
    label?: { [name: string]: boolean };
    category: string | null;
  }[],
  showSymbolThreshold: number,
) {
  if (showSymbolThreshold > 0) {
    nodes.forEach(function (node) {
      node.label = {
        show: node.value > showSymbolThreshold,
      };
    });
  }
}

function getNormalizedSymbolSize(
  nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: any;
    label?: { [name: string]: boolean };
    category: string | null;
  }[],
) {
  let minValue = Number.MAX_VALUE;
  let maxValue = Number.MIN_VALUE;
  nodes.forEach(node => {
    if (node.symbolSize > maxValue) {
      maxValue = node.symbolSize;
    }
    if (node.symbolSize < minValue) {
      minValue = node.symbolSize;
    }
  });
  nodes.forEach((node: { symbolSize: number }) => {
    node.symbolSize =
      ((node.symbolSize - minValue) / (maxValue - minValue)) * GraphConstants.nodeSizeRightLimit +
      GraphConstants.nodeSizeLeftLimit;
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
  let nodes: { [name: string]: number } = {};
  let echartNodes: {
    id: number;
    name: DataRecordValue;
    symbolSize?: any;
    value: any;
    label?: { [name: string]: boolean };
    category: string | null;
  }[] = [];
  let echartLinks: object[] = [];
  let echartCategories: string[] = [];
  let index = 0;
  let sourceIndex = 0;
  let targetIndex = 0;

  data.forEach(link => {
    const nodeSource = link[source];
    const nodeTarget = link[target];
    const nodeCategory = category ? link[category]!.toString() : 'default';
    const nodeValue = link[metricLabel];
    console.log('valiue is ', nodeValue);

    if (!(nodeSource in nodes)) {
      echartNodes.push({
        id: index,
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
        id: index,
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
  });

  setLabelVisibility(echartNodes, showSymbolThreshold);
  getNormalizedSymbolSize(echartNodes);
  console.log('props are ', getLegendProps(legendType, legendOrientation, showLegend));
  console.log('forceconfig ', {
    ...GraphConstants.forceConfig,
    edgeLength,
    gravity,
    repulsion,
    friction,
  });

  const echartOptions: echarts.EChartOption = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: GraphConstants.animationDuration,
    animationEasing: GraphConstants.animationEasing,
    tooltip: GraphConstants.tooltipConfiguration,
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: echartCategories,
    },
    series: [
      {
        name: name,
        zoom: GraphConstants.zoom,
        type: 'graph',
        categories: echartCategories.map(c => {
          return { name: c, itemStyle: { color: colorFn(c) } };
        }),
        layout: layout,
        force: { ...GraphConstants.forceConfig, edgeLength, gravity, repulsion, friction },
        circular: GraphConstants.circularConfig,
        data: echartNodes,
        links: echartLinks,
        roam: roam,
        draggable: draggable,
        edgeSymbol: GraphConstants.edgeSymbol,
        edgeSymbolSize: GraphConstants.edgeSymbolSize,
        selectedMode: selectedMode,
        autoCurveness: GraphConstants.autoCurveness,
        ...getChartPadding(showLegend, legendOrientation, legendMargin),
        animation: GraphConstants.animation,
        label: GraphConstants.labelConfig,
        lineStyle: GraphConstants.lineStyleConfiguration,
        emphasis: GraphConstants.emphasis,
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
