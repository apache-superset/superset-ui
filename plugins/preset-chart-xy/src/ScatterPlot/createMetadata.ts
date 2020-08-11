import { t } from '@superset-ui/core';
import { ChartMetadata } from '@superset-ui/chart';
import thumbnail from './images/thumbnail.png';

export default function createMetadata(useLegacyApi = false) {
  return new ChartMetadata({
    description: '',
    name: t('Scatter Plot'),
    thumbnail,
    useLegacyApi,
  });
}
