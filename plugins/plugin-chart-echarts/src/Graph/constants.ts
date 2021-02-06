import { GraphSeriesOption } from 'echarts';

export const GraphConstants: GraphSeriesOption = {
  zoom: 1,
  circular: { rotateLabel: true },
  force: {
    initLayout: 'circular',
    layoutAnimation: true,
  },
  edgeSymbol: ['circle', 'arrow'],
  edgeSymbolSize: [10, 10],
  label: {
    show: true,
    position: 'right',
    distance: 5,
    rotate: 0,
    offset: [0, 0],
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontFamily: 'sans-serif',
    fontSize: 12,
    padding: [0, 0, 0, 0],
    overflow: 'truncate',
    formatter: '{b}',
  },
  emphasis: {
    focus: 'adjacency',
    lineStyle: {
      width: 10,
    },
  },
  autoCurveness: 20,
  animation: true,
  animationDuration: 500,
  animationEasing: 'cubicOut',
  tooltip: { show: true, formatter: '{b}: {c}' },
  lineStyle: { color: 'source', curveness: 0.1 },
};

export const normalizationLimits = {
  nodeSizeLeftLimit: 10,
  nodeSizeRightLimit: 60,
};
