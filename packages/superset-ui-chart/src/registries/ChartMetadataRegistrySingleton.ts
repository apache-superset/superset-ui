import { Registry, makeSingleton, OverwritePolicy } from '@superset-ui/core';
import { ChartMetadataConfig } from '../models/ChartMetadata';

class ChartMetadataRegistry extends Registry<ChartMetadataConfig, ChartMetadataConfig> {
  constructor() {
    super({ name: 'ChartMetadata', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartMetadataRegistry);

export default getInstance;
