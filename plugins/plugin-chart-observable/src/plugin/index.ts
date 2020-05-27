import { t } from '@superset-ui/translation';
import { ChartMetadata, ChartPlugin } from '@superset-ui/chart';
import transformProps from './transformProps';
import buildQuery from './buildQuery';
import { ObservableFormData } from '../types';
import thumbnail from '../images/thumbnail.png';
import controlPanel from './controlPanel';

const metadata = new ChartMetadata({
  credits: ['https://preset.io'],
  description: 'Superset implementation of the Observable HQ runtime',
  name: t('Observable'),
  thumbnail,
});

export default class ObservableChartPlugin extends ChartPlugin<ObservableFormData> {
  constructor() {
    super({
      buildQuery,
      loadChart: () => import('../chart/Observable'),
      metadata,
      transformProps,
      controlPanel,
    });
  }
}
