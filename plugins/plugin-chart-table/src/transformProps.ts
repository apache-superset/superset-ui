/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { DataRecord } from '@superset-ui/chart';
import { QueryFormDataMetric } from '@superset-ui/query';
import { getNumberFormatter, NumberFormats } from '@superset-ui/number-format';
import { getTimeFormatter } from '@superset-ui/time-format';

import { TableChartProps, TableChartTransformedProps } from './types';

const { PERCENT_3_POINT } = NumberFormats;

/**
 * Consolidate list of metrics to string, identified by its unique identifier
 */
function consolidateMetricShape(metric: QueryFormDataMetric) {
  if (typeof metric === 'string') return metric;
  // even thought `metric.optionName` is more unique, it's not used
  // anywhere else in `queryData` and cannot be used to access `data.records`.
  // The records are still keyed by `metric.label`.
  return metric.label || 'NOT_LABLED';
}

function isTimeColumn(key: string, data: DataRecord[] = []) {
  return key === '__timestamp' || data.some(x => x[key] instanceof Date);
}

export default function transformProps(chartProps: TableChartProps): TableChartTransformedProps {
  const {
    height,
    datasource,
    formData,
    queryData,
    initialValues: filters = {},
    hooks: { onAddFilter: onChangeFilter = () => {} },
  } = chartProps;
  const {
    alignPn: alignPositiveNegative = true,
    colorPn: colorPositiveNegative = true,
    showCellBars = true,
    includeSearch = false,
    pageLength: pageSize = 0,
    metrics: metrics_ = [],
    percentMetrics: percentMetrics_ = [],
    tableTimestampFormat,
    tableFilter,
    timeGrainSqla: granularity,
    orderDesc: sortDesc = false,
  } = formData;
  const { columnFormats, verboseMap } = datasource;
  const { records, columns: columns_ } = queryData.data || { records: [], columns: [] };
  const metrics = (metrics_ ?? []).map(consolidateMetricShape);
  const percentMetrics = (percentMetrics_ ?? [])
    .map(consolidateMetricShape)
    // column names for percent metrics always starts with a '%' sign.
    .map((x: string) => `%${x}`);
  const metricsSet = new Set(metrics);
  const percentMetricsSet = new Set(percentMetrics);

  const columns = columns_.map((key: string) => {
    let label = verboseMap?.[key] || key;
    if (label[0] === '%' && label[1] !== ' ') {
      // add a " " after "%" for percent metric labels
      label = `% ${label.slice(1)}`;
    }
    // percent metrics have a default format
    const format = columnFormats?.[key];
    const isTime = isTimeColumn(key, records);
    const isMetric = metricsSet.has(key);
    const isPercentMetric = percentMetricsSet.has(key);
    let formatter;
    if (isTime) {
      formatter = getTimeFormatter(format || tableTimestampFormat, granularity);
    } else if (isMetric) {
      formatter = getNumberFormatter(format);
    } else if (isPercentMetric) {
      formatter = getNumberFormatter(format || PERCENT_3_POINT);
    }
    return {
      key,
      label,
      isMetric,
      isPercentMetric,
      isTime,
      formatter,
    };
  });

  return {
    height,
    data: records,
    columns,
    metrics,
    percentMetrics,
    alignPositiveNegative,
    colorPositiveNegative,
    showCellBars,
    sortDesc,
    includeSearch,
    pageSize: typeof pageSize === 'string' ? Number(pageSize) || 0 : pageSize,
    filters,
    emitFilter: tableFilter === true,
    onChangeFilter,
  };
}
