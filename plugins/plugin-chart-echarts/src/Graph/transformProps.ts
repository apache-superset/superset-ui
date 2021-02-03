import {
  EchartsGraphFormData,
  DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA,
  GraphConstants,
} from './types';
import {
  CategoricalColorNamespace,
  ChartProps,
  getMetricLabel,
  DataRecord,
  DataRecordValue,
} from '@superset-ui/core';
import { EchartsProps } from '../types';

function normalizeSymbolSize(
  nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: any;
    label?: { [name: string]: boolean };
    category: string | null;
  }[],
) {
  let max = Number.MIN_VALUE;
  let min = Number.MAX_VALUE;
  nodes.forEach((node: { symbolSize: any }) => {
    const symbolSize = node.symbolSize;
    if (symbolSize > max) {
      max = symbolSize;
    }
    if (symbolSize < min) {
      min = symbolSize;
    }
  });

  nodes.forEach((node: { symbolSize: number }) => {
    node.symbolSize = ((node.symbolSize - min) / (max - min)) * 60 + 10;
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
  }: EchartsGraphFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };

  const metricLabel = getMetricLabel(metric);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  let nodes: { [name: string]: number } = {};
  let echart_nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: any;
    label?: { [name: string]: boolean };
    category: string | null;
  }[] = [];
  let echart_links: object[] = [];
  let echart_categories: string[] = [];
  let index = 0;
  let source_index = 0;
  let target_index = 0;

  data.forEach(link => {
    const node_source: any = link[source];
    const node_target: any = link[target];
    const node_category: string = category ? link[category]!.toString() : 'default';

    if (!(node_source in nodes)) {
      echart_nodes.push({
        id: index,
        name: node_source,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
        category: node_category,
      });
      source_index = index;
      nodes[node_source] = index;
      index += 1;
    } else {
      source_index = nodes[node_source];
      echart_nodes[source_index].value += link[metricLabel];
      echart_nodes[source_index].symbolSize += link[metricLabel];
    }

    if (!(node_target in nodes)) {
      echart_nodes.push({
        id: index,
        name: node_target,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
        category: node_category,
      });
      target_index = index;
      nodes[node_target] = index;
      index += 1;
    } else {
      target_index = nodes[node_target];
      echart_nodes[target_index].value += link[metricLabel];
      echart_nodes[target_index].symbolSize += link[metricLabel];
    }
    echart_links.push({ source: source_index.toString(), target: target_index.toString() });

    if (!echart_categories.includes(node_category)) {
      echart_categories.push(node_category);
    }
  });
  if (showSymbolThreshold > 0) {
    echart_nodes.forEach(function (node) {
      node.label = {
        show: node.value > showSymbolThreshold,
      };
    });
  }

  normalizeSymbolSize(echart_nodes);

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
    legend: [{ data: echart_categories }],
    series: [
      {
        name: name,
        zoom: GraphConstants.zoom,
        type: 'graph',
        categories: echart_categories.map(c => {
          return { name: c, itemStyle: { color: colorFn(c) } };
        }),
        layout: layout,
        force: GraphConstants.forceConfig,
        circular: GraphConstants.circularConfig,
        data: echart_nodes,
        links: echart_links,
        roam: roam,
        draggable: draggable,
        edgeSymbol: GraphConstants.edgeSymbol,
        edgeSymbolSize: GraphConstants.edgeSymbolSize,
        selectedMode: selectedMode,
        autoCurveness: GraphConstants.autoCurveness,
        left: GraphConstants.left,
        top: GraphConstants.top,
        bottom: GraphConstants.bottom,
        right: GraphConstants.right,
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
