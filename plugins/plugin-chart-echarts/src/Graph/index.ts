import { t, ChartMetadata, ChartPlugin } from '@superset-ui/core';
import controlPanel from './controlPanel';
import transformProps from './transformProps';
import thumbnail from './images/thumbnail.png';

export default class EchartsGraphChartPlugin extends ChartPlugin {
  constructor() {
    super({
      controlPanel,
      loadChart: () => import('./EchartsGraph'),
      metadata: new ChartMetadata({
        credits: ['me'],
        name: t('Force-directed Graph'),
        thumbnail,
      }),
      transformProps,
    });
  }
}
