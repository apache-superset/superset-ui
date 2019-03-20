import { Registry, makeSingleton, OverwritePolicy } from '@superset-ui/core';
import { ChartMetaDataConfig } from '../models/ChartMetadata';

class ChartMetadataRegistry extends Registry<ChartMetaDataConfig, ChartMetaDataConfig> {
  constructor() {
    super({ name: 'ChartMetadata', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartMetadataRegistry);

export default getInstance;
