/* eslint-disable camelcase */
import { QueryObject } from './types/Query';
import { QueryFormData, isSqlaFormData, QueryFormDataMetric } from './types/QueryFormData';
import convertMetric from './convertMetric';
import processFilters from './processFilters';
import processMetrics from './processMetrics';
import processExtras from './processExtras';

export const DTTM_ALIAS = '__timestamp';

function processGranularity(formData: QueryFormData): string {
  return isSqlaFormData(formData) ? formData.granularity_sqla : formData.granularity;
}

/**
 * Build the common segments of all query objects (e.g. the granularity field derived from
 * either sql alchemy or druid). The segments specific to each viz type is constructed in the
 * buildQuery method for each viz type (see `wordcloud/buildQuery.ts` for an example).
 * Note the type of the formData argument passed in here is the type of the formData for a
 * specific viz, which is a subtype of the generic formData shared among all viz types.
 */
export default function buildQueryObject<T extends QueryFormData>(formData: T): QueryObject {
  const {
    time_range,
    since,
    until,
    order_desc,
    row_limit,
    limit,
    timeseries_limit_metric,
    controlGroups = {
      /** These are predefined for backward compatibility */
      metric: 'metrics',
      percent_metrics: 'metrics',
      metric_2: 'metrics',
      secondary_metric: 'metrics',
      x: 'metrics',
      y: 'metrics',
      size: 'metrics',
    },
    ...residualFormData
  } = formData;

  type GroupedControlData = {
    columns: string[];
    groupby: string[];
    metrics: QueryFormDataMetric[];
  };
  type ResidualGroupedControlData = {
    [key: string]: QueryFormDataMetric[];
  };
  const groupedControls: GroupedControlData & ResidualGroupedControlData = {
    columns: [],
    groupby: [],
    metrics: [],
  };

  Object.entries(residualFormData).forEach(entry => {
    const [key, residualValue] = entry;
    if (Object.prototype.hasOwnProperty.call(controlGroups, key)) {
      const controlGroup = controlGroups[key];
      const controlValue = residualFormData[key];
      groupedControls[controlGroup] = (groupedControls[controlGroup] || []).concat(controlValue);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      groupedControls[key] = (groupedControls[key] || []).concat(residualValue);
    }
  });
  const { metrics, groupby, columns } = groupedControls;
  const groupbySet = new Set([...columns, ...groupby]);
  const numericRowLimit = Number(row_limit);

  return {
    extras: processExtras(formData),
    granularity: processGranularity(formData),
    groupby: Array.from(groupbySet),
    is_timeseries: groupbySet.has(DTTM_ALIAS),
    metrics: processMetrics(metrics),
    order_desc: typeof order_desc === 'undefined' ? true : order_desc,
    orderby: [],
    row_limit: row_limit == null || Number.isNaN(numericRowLimit) ? undefined : numericRowLimit,
    since,
    time_range,
    timeseries_limit: limit ? Number(limit) : 0,
    timeseries_limit_metric: timeseries_limit_metric
      ? convertMetric(timeseries_limit_metric)
      : null,
    until,
    ...processFilters(formData),
  };
}
