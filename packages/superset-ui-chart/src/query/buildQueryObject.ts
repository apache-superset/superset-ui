/* eslint-disable camelcase */
import Metrics from './Metrics';
import { QueryObject, QueryObjectExtras } from '../types/Query';
import { ChartFormData, DruidFormData, SqlaFormData } from '../types/ChartFormData';

const DTTM_ALIAS = '__timestamp';

function isDruidFormData(formData: ChartFormData): formData is DruidFormData {
  return 'granularity' in formData;
}

function isSqlaFormData(formData: ChartFormData): formData is SqlaFormData {
  return 'granularity_sqla' in formData;
}

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

  // Logic formerly in viz.py
  // utils.convert_legacy_filters_into_adhoc(self.form_data)
  // merge_extra_filters(self.form_data)
  // utils.split_adhoc_filters_into_base_filters(self.form_data)

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
  };

  return queryObject;
}
