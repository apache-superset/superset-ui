import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';
import buildQuery from './buildQuery';

export default class EchartsGraphChartPlugin extends ChartPlugin {
  constructor() {
    super({
      buildQuery,
      controlPanel,
      loadChart: () => import('./EchartsGraph'),
      metadata: new ChartMetadata({
        credits: ['https://echarts.apache.org'],
        name: t('Graph Chart'),
        thumbnail,
      }),
      transformProps,
    });
  }
}
