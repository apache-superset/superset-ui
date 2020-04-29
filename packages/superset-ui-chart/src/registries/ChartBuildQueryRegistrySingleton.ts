import { Registry, makeSingleton, OverwritePolicy } from '@superset-ui/core';
import { QueryContext } from '@superset-ui/query';
import { PlainObject } from '../types/Base';

// Ideally this would be <T extends QueryFormData>
type BuildQuery = (formData: PlainObject) => QueryContext;

class ChartBuildQueryRegistry extends Registry<BuildQuery> {
  constructor() {
    super({ name: 'ChartBuildQuery', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartBuildQueryRegistry);

export default getInstance;
