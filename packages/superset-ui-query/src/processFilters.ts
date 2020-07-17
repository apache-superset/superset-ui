/* eslint-disable camelcase */
import { QueryFormData } from './types/QueryFormData';
import { QueryObjectFilterClause } from './types/Query';
import { isSimpleAdhocFilter } from './types/Filter';
import convertFilter from './convertFilter';
import processExtraFilters from './processExtraFilters';

/** Logic formerly in viz.py's process_query_filters */
export default function processFilters(formData: QueryFormData) {
  // TODO: Implement
  // utils.convert_legacy_filters_into_adhoc(self.form_data)

  // TODO: Implement
  // merge_extra_filters(self.form_data)

  // Split adhoc_filters into four fields according to
  // (1) clause (WHERE or HAVING)
  // (2) expressionType
  //     2.1 SIMPLE (subject + operator + comparator)
  //     2.2 SQL (freeform SQL expression))
  const { adhoc_filters } = formData;
  if (Array.isArray(adhoc_filters)) {
    const simpleWhere: QueryObjectFilterClause[] = [];
    const simpleHaving: QueryObjectFilterClause[] = [];
    const freeformWhere: string[] = [];
    if (formData.where) freeformWhere.push(formData.where);
    const freeformHaving: string[] = [];

    adhoc_filters.forEach(filter => {
      const { clause } = filter;
      if (isSimpleAdhocFilter(filter)) {
        const filterClause = convertFilter(filter);
        if (clause === 'WHERE') {
          simpleWhere.push(filterClause);
        } else {
          simpleHaving.push(filterClause);
        }
      } else {
        const { sqlExpression } = filter;
        if (clause === 'WHERE') {
          freeformWhere.push(sqlExpression);
        } else {
          freeformHaving.push(sqlExpression);
        }
      }
    });

    const extraFilters = processExtraFilters(formData);
    const {
      druid_time_origin,
      filters,
      granularity,
      granularity_sqla,
      time_range,
      time_grain_sqla,
    } = extraFilters;

    return {
      druid_time_origin: druid_time_origin || formData.druid_time_origin,
      // @ts-ignore
      filters: filters.concat(simpleWhere),
      granularity: granularity || formData.granularity,
      granularity_sqla: granularity_sqla || formData.granularity_sqla,
      having: freeformHaving.map(exp => `(${exp})`).join(' AND '),
      having_druid: formData.having_druid,
      having_filters: simpleHaving,
      time_grain_sqla: time_grain_sqla || formData.time_grain_sqla,
      time_range: time_range || formData.time_range,
      where: freeformWhere.map(exp => `(${exp})`).join(' AND '),
    };
  }

  return {};
}
