/* eslint-disable camelcase */
import Metrics from './Metrics';
import { QueryObject, QueryObjectExtras, QueryObjectFilterClause } from '../types/Query';
import { ChartFormData, isSqlaFormData, isDruidFormData } from '../types/ChartFormData';
import {
  AdhocFilter,
  SimpleAdhocFilter,
  isUnaryAdhocFilter,
  isBinaryAdhocFilter,
} from '../types/formData/Filter';

const DTTM_ALIAS = '__timestamp';

function getGranularity(formData: ChartFormData): string {
  return isSqlaFormData(formData) ? formData.granularity_sqla : formData.granularity;
}

function getExtras(formData: ChartFormData): QueryObjectExtras {
  const { where = '' } = formData;

  if (isDruidFormData(formData)) {
    const { druid_time_origin, having_druid } = formData;

    return { druid_time_origin, having_druid, where };
  }

  const { time_grain_sqla, having } = formData;

  return { having, time_grain_sqla, where };
}

function isSimpleAdhocFilter(filter: AdhocFilter): filter is SimpleAdhocFilter {
  return filter.expressionType === 'SIMPLE';
}

function convertAdhocFilterToQueryObjectFilterClause(
  filter: SimpleAdhocFilter,
): QueryObjectFilterClause {
  const { subject } = filter;
  if (isUnaryAdhocFilter(filter)) {
    const { operator } = filter;

    return {
      col: subject,
      op: operator,
    };
  } else if (isBinaryAdhocFilter(filter)) {
    const { operator } = filter;

    return {
      col: subject,
      op: operator,
      val: filter.comparator,
    };
  }

  const { operator } = filter;

  return {
    col: subject,
    op: operator,
    val: filter.comparator,
  };
}

/** Logic formerly in viz.py's process_query_filters */
function getFilters(formData: ChartFormData) {
  // TODO: Implement
  // utils.convert_legacy_filters_into_adhoc(self.form_data)

  // TODO: Implement
  // merge_extra_filters(self.form_data)

  // utils.split_adhoc_filters_into_base_filters(self.form_data)
  const { adhoc_filters } = formData;
  if (Array.isArray(adhoc_filters)) {
    const simpleWhere: QueryObjectFilterClause[] = [];
    const simpleHaving: QueryObjectFilterClause[] = [];
    const freeformWhere: string[] = [];
    const freeformHaving: string[] = [];

    adhoc_filters.forEach(filter => {
      const { clause } = filter;
      if (isSimpleAdhocFilter(filter)) {
        const filterClause = convertAdhocFilterToQueryObjectFilterClause(filter);
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

    return {
      filters: simpleWhere,
      having: freeformHaving.map(exp => `(${exp})`).join(' AND '),
      having_filters: simpleHaving,
      where: freeformWhere.map(exp => `(${exp})`).join(' AND '),
    };
  }

  return {};
}

// Build the common segments of all query objects (e.g. the granularity field derived from
// either sql alchemy or druid). The segments specific to each viz type is constructed in the
// buildQuery method for each viz type (see `wordcloud/buildQuery.ts` for an example).
// Note the type of the formData argument passed in here is the type of the formData for a
// specific viz, which is a subtype of the generic formData shared among all viz types.
export default function buildQueryObject<T extends ChartFormData>(formData: T): QueryObject {
  const {
    time_range,
    since,
    until,
    columns = [],
    groupby = [],
    order_desc,
    row_limit,
    limit,
    timeseries_limit_metric,
  } = formData;

  const groupbySet = new Set([...columns, ...groupby]);

  const queryObject: QueryObject = {
    extras: getExtras(formData),
    granularity: getGranularity(formData),
    groupby: Array.from(groupbySet),
    is_prequery: false,
    is_timeseries: groupbySet.has(DTTM_ALIAS),
    metrics: new Metrics(formData).getMetrics(),
    order_desc: order_desc === undefined ? true : order_desc,
    orderby: [],
    prequeries: [],
    row_limit: Number(row_limit),
    since,
    time_range,
    timeseries_limit: limit ? Number(limit) : 0,
    timeseries_limit_metric: timeseries_limit_metric
      ? Metrics.formatMetric(timeseries_limit_metric)
      : null,
    until,
    ...getFilters(formData),
  };

  return queryObject;
}
