/* eslint-disable camelcase */
import { QueryFormData } from './types/QueryFormData';
import {
  isQueryObjectBinaryFilterClause,
  isQueryObjectSetFilterClause,
  QueryObject,
  QueryObjectBinaryFilterClause,
} from './types/Query';

export default function processExtras(formData: Partial<QueryFormData>): Partial<QueryObject> {
  const partialQueryObject: Partial<QueryObject> = {
    filters: [],
  };
  const reservedColumnsToQueryField: Record<string, keyof QueryObject> = {
    __time_range: 'time_range',
    __time_col: 'granularity_sqla',
    __time_grain: 'time_grain_sqla',
    __time_origin: 'druid_time_origin',
    __granularity: 'granularity',
  };

  const { extra_filters: formDataExtraFilters } = formData;
  if (Array.isArray(formDataExtraFilters)) {
    formDataExtraFilters.forEach(filter => {
      if (filter.col in reservedColumnsToQueryField) {
        const queryField = reservedColumnsToQueryField[filter.col];
        partialQueryObject[queryField] = (filter as QueryObjectBinaryFilterClause).val;
      } else if (isQueryObjectBinaryFilterClause(filter) || isQueryObjectSetFilterClause(filter)) {
        // FilterBox sends invalid filters (val === undefined) if no options
        // are selected. The if-statement above ensures that they are valid.
        // @ts-ignore
        partialQueryObject.filters.push(filter);
      }
    });
  }
  return partialQueryObject;
}
