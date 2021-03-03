import { Registry, makeSingleton, OverwritePolicy, QueryContext, SetDataMaskHook } from '../..';

// Ideally this would be <T extends QueryFormData>
type BuildQuery = (
  formData: any,
  {
    hooks: { setDataMask },
  }: { hooks: { setDataMask: SetDataMaskHook; [key: string]: any } },
) => QueryContext;

class ChartBuildQueryRegistry extends Registry<BuildQuery> {
  constructor() {
    super({ name: 'ChartBuildQuery', overwritePolicy: OverwritePolicy.WARN });
  }
}

const getInstance = makeSingleton(ChartBuildQueryRegistry);

export default getInstance;
