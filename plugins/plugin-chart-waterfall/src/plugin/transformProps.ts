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
import { ChartProps, DataRecord } from '@superset-ui/chart';
import { t } from '@superset-ui/translation';

type WaterfallDatum = DataRecord;

const convertDataForRecharts = ({ periodColumn, xAxisColumn, valueColumn, data }) => {
  // Group by period (temporary map)
  data = data.reduce((acc, cur) => {
    const period = cur[periodColumn];
    const periodData = acc.get(period) || [];
    periodData.push(cur);
    acc.set(period, periodData);
    return acc;
  }, new Map());

  let resultData = [];
  let counter = 0;
  data.forEach((val, key) => {
    // Sort for waterfall Desc
    val.sort((a, b) => a.period - b.period);
    // Calc total per period
    const sum = val.reduce((acc, cur) => acc + cur[valueColumn], 0);
    // Push total per period to the end of period values array
    val.push({
      [xAxisColumn]: key,
      [periodColumn]: '__TOTAL__',
      [valueColumn]: sum,
    });
    // remove first period and leave only last one
    if (counter++ === 0) {
      val = [val[val.length - 1]];
    }
    resultData = resultData.concat(val);
  });
  return resultData;
};

const createReChartsBarValues = ({ rechartsData, valueColumn, periodColumn }) =>
  // Create ReCharts values array of deltas for bars
  rechartsData.map((cur, index) => {
    let totalSumUpToCur = 0;
    for (let i = 0; i < index; i++) {
      // Ignore calculation on period column
      if (rechartsData[i][periodColumn] !== '__TOTAL__' || i === 0) {
        totalSumUpToCur += rechartsData[i][valueColumn];
      }
    }

    if (cur[periodColumn] === '__TOTAL__') {
      return {
        ...cur,
        __TOTAL__: true,
        [valueColumn]: [0, totalSumUpToCur || cur[valueColumn]],
      };
    }

    return {
      ...cur,
      [valueColumn]: [totalSumUpToCur, totalSumUpToCur + cur[valueColumn]],
    };
  });

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queryData } = chartProps;
  console.log(JSON.stringify({ width, height, formData, queryData }));
  let data = queryData.data as WaterfallDatum[];

  const { periodColumn, xAxisColumn, metrics } = formData;

  if (metrics.length !== 1) {
    return {
      error: t('Please choose only one "Metric" in "Query" section'),
    };
  }

  const valueColumn = metrics[0].label;
  // Remove bars with value 0
  data = data.filter(item => item[valueColumn] !== 0);

  // Sort by period (ascending)
  data.sort((a, b) => Number.parseInt(a.period) - Number.parseInt(b.period));

  const rechartsData = convertDataForRecharts({
    periodColumn,
    xAxisColumn,
    valueColumn,
    data,
  });

  const resultData = createReChartsBarValues({
    rechartsData,
    valueColumn,
    periodColumn,
  });

  const onBarClick = () => {
    // TODO: Uncomment when dashboard will support ChartsFilter
    // hooks.onAddFilter({ [filterConfigs[0].column]: [data[filterConfigs[0].column]] }, false);
  };
  const resetFilters = () => {
    // TODO: Uncomment when dashboard will support ChartsFilter
    // hooks.onAddFilter({ [filterConfigs[0].column]: null }, false);
  };

  return {
    dataKey: valueColumn,
    xAxisDataKey: xAxisColumn,
    width,
    height,
    data: resultData,
    onBarClick,
    resetFilters,
  };
}
