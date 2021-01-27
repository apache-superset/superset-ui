import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { ChartProps, getMetricLabel, DataRecord, DataRecordValue } from '@superset-ui/core';
import { EchartsProps } from '../types';

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    name,
    metric = '',
    zoom,
    layout,
    circularConfig,
    forceConfig,
    roam,
    draggable,
    edgeSymbol,
    edgeSymbolSize,
    itemStyle,
    labelConfig,
    emphasis,
    selectedMode,
    autoCurveness,
    left,
    top,
    right,
    bottom,
    animation,
    animationDuration,
    animationEasing,
    showSymbolThreshold,
    tooltipConfiguration,
    lineStyleConfiguration,
  }: EchartsGraphFormData = { ...DEFAULT_GRAPH_FORM_DATA, ...formData };

  const metricLabel = getMetricLabel(metric);
  var index: number = 0;
  var nodes: { [name: string]: number } = {}; //{agri: 0, carbon: 1}
  var echart_nodes: {
    id: number;
    name: DataRecordValue;
    symbolSize: any;
    value: DataRecordValue;
    label?: { [name: string]: boolean };
  }[] = []; // [{id,name,symbol,x,y,value} , {}]
  var echart_links: object[] = []; // [{source, target}, {}]
  var index = 0;
  var source_index = 0;
  var target_index = 0;
  data.forEach(link => {
    const source: any = link.source;
    const target: any = link.target;
    if (!(source in nodes)) {
      echart_nodes.push({
        id: index,
        name: source,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
      });
      source_index = index;
      nodes[source] = index;
      index += 1;
    } else {
      source_index = nodes[source];
      echart_nodes[source_index].symbolSize += link[metricLabel];
    }

    if (!(target in nodes)) {
      echart_nodes.push({
        id: index,
        name: target,
        value: link[metricLabel],
        symbolSize: link[metricLabel],
      });
      target_index = index;
      nodes[target] = index;
      index += 1;
    } else {
      target_index = nodes[target];
      echart_nodes[target_index].symbolSize += link[metricLabel];
    }
    echart_links.push({ source: source_index.toString(), target: target_index.toString() });
  });
  if (showSymbolThreshold > 0) {
    echart_nodes.forEach(function (node) {
      node.label = {
        show: node.symbolSize > showSymbolThreshold,
      };
    });
  }

  console.log('nodes', echart_nodes);
  console.log('links ', echart_links);

  const echartOptions = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: animationDuration,
    animationEasing: animationEasing,
    series: [
      {
        name: name,
        zoom: zoom,
        type: 'graph',
        layout: layout,
        force: forceConfig,
        circular: circularConfig,
        data: echart_nodes,
        links: echart_links,
        roam: roam,
        draggable: draggable,
        edgeSymbol: edgeSymbol,
        edgeSymbolSize: edgeSymbolSize,
        itemStyle: itemStyle,
        selectedMode: selectedMode,
        autoCurveness: autoCurveness,
        left: left,
        top: top,
        bottom: bottom,
        right: right,
        animation: animation,
        label: labelConfig,
        lineStyle: lineStyleConfiguration,
        emphasis: emphasis,
        tooltip: tooltipConfiguration,
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
