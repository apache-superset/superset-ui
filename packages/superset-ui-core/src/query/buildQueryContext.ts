import buildQueryObject from './buildQueryObject';
import DatasourceKey from './DatasourceKey';
import { QueryFieldAliases, QueryFormData } from './types/QueryFormData';
import { QueryContext, QueryObject } from './types/Query';
import { SetDataMaskHook } from '../chart';

const WRAP_IN_ARRAY = (baseQueryObject: QueryObject, hooks: { setDataMask: SetDataMaskHook }) => [
  baseQueryObject,
];

export type BuildFinalQuerieObjects = (baseQueryObject: QueryObject) => QueryObject[];

export default function buildQueryContext(
  formData: QueryFormData,
  options?:
    | {
        buildQuery?: BuildFinalQuerieObjects;
        queryFields?: QueryFieldAliases;
        hooks?: { setDataMask: SetDataMaskHook };
      }
    | BuildFinalQuerieObjects,
): QueryContext {
  const { queryFields, buildQuery = WRAP_IN_ARRAY, hooks = {} } =
    typeof options === 'function' ? { buildQuery: options, queryFields: {} } : options || {};
  return {
    datasource: new DatasourceKey(formData.datasource).toObject(),
    force: formData.force || false,
    queries: buildQuery(buildQueryObject(formData, queryFields), {
      setDataMask: () => {},
      ...hooks,
    }),
    result_format: formData.result_format || 'json',
    result_type: formData.result_type || 'full',
  };
}
