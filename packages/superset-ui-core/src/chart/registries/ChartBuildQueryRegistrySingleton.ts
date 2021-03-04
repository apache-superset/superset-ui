import { Registry, makeSingleton, OverwritePolicy, QueryContext, SetDataMaskHook } from '../..';

// Ideally this would be <T extends QueryFormData>
export type BuildQuery<T = any> = (
  formData: T,
  options?: {
    hooks?: {
      [key: string]: any;
      setDataMask: SetDataMaskHook;
      cachedChanges?: any;
      setCachedChanges: (newChanges: any) => void;
    };
  },
) => QueryContext;

class ChartBuildQueryRegistry extends Registry<BuildQuery> {
  constructor() {
    super({ name: 'ChartBuildQuery', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartBuildQueryRegistry);

export default getInstance;
