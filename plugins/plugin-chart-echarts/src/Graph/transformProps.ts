import { EchartsGraphFormData, DEFAULT_FORM_DATA as DEFAULT_GRAPH_FORM_DATA } from './types';
import { ChartProps } from '@superset-ui/core';
import { EchartsProps } from '../types';

function randomIntFromInterval(min, max) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function transformProps(chartProps: ChartProps): EchartProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    name,
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

  var index: number = 0;
  var nodes: { [name: string]: number } = {}; //{agri: 0, carbon: 1}
  var echart_nodes: {
    id: number;
    name: string;
    symbolSize: number;
    x: number;
    y: number;
    value: number;
    label?: { [name: string]: boolean };
  }[] = []; // [{id,name,symbol,x,y,value} , {}]
  var echart_links: object[] = []; // [{source, target}, {}]
  var index = 0;
  var source_index = 0;
  var target_index = 0;
  data.forEach(link => {
    const source: string = link.source;
    const target: string = link.target;
    if (!(source in nodes)) {
      echart_nodes.push({
        id: index,
        name: source,
        value: link.value,
        symbolSize: link.value,
        x: randomIntFromInterval(-200, 100),
        y: randomIntFromInterval(-200, 100),
      });
      source_index = index;
      nodes[source] = index;
      index += 1;
    } else {
      source_index = nodes[source];
      echart_nodes[source_index].symbolSize += link.value;
    }

    if (!(target in nodes)) {
      echart_nodes.push({
        id: index,
        name: target,
        value: link.value,
        symbolSize: link.value * 2,
        x: randomIntFromInterval(-200, 100),
        y: randomIntFromInterval(-200, 100),
      });
      target_index = index;
      nodes[target] = index;
      index += 1;
    } else {
      target_index = nodes[target];
      echart_nodes[target_index].symbolSize += link.value;
    }
    echart_links.push({ source: source_index.toString(), target: target_index.toString() });
  });
  echart_nodes.forEach(function (node: typeof echart_nodes[0]) {
    node.label = {
      show: node.symbolSize > showSymbolThreshold,
    };
  });

  const echartOptions = {
    title: {
      text: name,
      subtext: 'Default layout',
      top: 'bottom',
      left: 'right',
    },
    animationDuration: animationDuration,
    //animationEasing: animationEasing,
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
        //draggable: draggable,
        edgeSymbol: edgeSymbol,
        edgeSymbolSize: edgeSymbolSize,
        itemStyle: itemStyle,
        selectedMode: selectedMode,
        autoCurveness: autoCurveness,
        //left: left,
        //top:top,
        //bottom:bottom,
        //right:right,
        //animation:animation,
        label: labelConfig,
        //lineStyle: lineStyleConfiguration,
        emphasis: {
          focus: 'adjacency',
          lineStyle: {
            width: 10,
          },
        },
      },
    ],
  };

  return {
    width,
    height,
    echartOptions,
  };
}
