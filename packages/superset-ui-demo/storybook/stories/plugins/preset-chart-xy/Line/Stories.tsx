import { LineChartPlugin, LegacyLineChartPlugin } from '@superset-ui/preset-chart-xy';
import { LINE_PLUGIN_TYPE, LINE_PLUGIN_LEGACY_TYPE } from './constants';

new LegacyLineChartPlugin().configure({ key: LINE_PLUGIN_LEGACY_TYPE }).register();
new LineChartPlugin().configure({ key: LINE_PLUGIN_TYPE }).register();

export default {
  title: 'Chart Plugins|preset-chart-xy/Line',
};

export { default as basic } from './stories/basic';
export { default as withLabelFlush } from './stories/flush';
export { default as withMissingData } from './stories/missing';
export { default as legacyShim } from './stories/legacy';
export { default as withTimeShift } from './stories/timeShift';
