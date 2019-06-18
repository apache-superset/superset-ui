import buildQueryObject from './buildQueryObject';
import DatasourceKey from './DatasourceKey';
import { QueryFormData } from './types/QueryFormData';
import { QueryContext, QueryObject } from './types/Query';

const WRAP_IN_ARRAY = (baseQueryObject: QueryObject) => [baseQueryObject];

export default function buildQueryContext(
  formData: QueryFormData,
  buildQuery: (baseQueryObject: QueryObject) => QueryObject[] = WRAP_IN_ARRAY,
): QueryContext {
  return {
    datasource: new DatasourceKey(formData.datasource).toObject(),
    queries: buildQuery(buildQueryObject(formData)),
  };
}
