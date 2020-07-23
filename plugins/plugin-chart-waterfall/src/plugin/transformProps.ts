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

export default function transformProps(chartProps: ChartProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your Waterfall.tsx file, but
   * doing supplying custom props here is often handy for integrating third
   * party libraries that rely on specific props.
   *
   * A description of properties in `chartProps`:
   * - `height`, `width`: the height/width of the DOM element in which
   *   the chart is located
   * - `formData`: the chart data request payload that was sent to the
   *   backend.
   * - `queryData`: the chart data response payload that was received
   *   from the backend. Some notable properties of `queryData`:
   *   - `data`: an array with data, each row with an object mapping
   *     the column/alias to its value. Example:
   *     `[{ col1: 'abc', metric1: 10 }, { col1: 'xyz', metric1: 20 }]`
   *   - `rowcount`: the number of rows in `data`
   *   - `query`: the query that was issued.
   *
   * Please note: the transformProps function gets cached when the
   * application loads. When making changes to the `transformProps`
   * function during development with hot reloading, changes won't
   * be seen until restarting the development server.
   */
  const { width, height, formData, queryData, hooks } = chartProps;
  let data = queryData.data as WaterfallDatum[];

  const { periodColumn, xAxisColumn, metrics, filterConfigs, extraFilters } = formData;

  if (metrics.length !== 1) {
    return {
      error: t('Please choose only one "Metric" in "Query" section'),
    };
  }

  const valueColumn = metrics[0].label;

  console.log('formData via TransformProps.ts', formData);

  data = data.filter(item => item[valueColumn] !== 0);
  // Sort by period
  data.sort((a, b) => Number.parseInt(a.period) - Number.parseInt(b.period));

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
    // sort for waterfall desc
    val.sort((a, b) => a.period - b.period);
    // calc total per period
    const sum = val.reduce((acc, cur) => acc + cur[valueColumn], 0);
    // push total per period to the end of data
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

  console.log('data', data.values(), resultData);

  // create recharts value array for deltas
  const rechartsData = resultData.map((cur, index) => {
    let totalSumUpToCur = 0;
    for (let i = 0; i < index; i++) {
      // ignore calculation on period column
      if (resultData[i][periodColumn] !== '__TOTAL__' || i === 0) {
        totalSumUpToCur += resultData[i][valueColumn];
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

  console.log('Recharts data', rechartsData);
  const onBarClick = data => {
    hooks.onAddFilter({ [filterConfigs[0].column]: [data[filterConfigs[0].column]] }, false);
  };
  const resetFilters = () => {
    hooks.onAddFilter({ [filterConfigs[0].column]: null }, false);
  };

  return {
    dataKey: valueColumn,
    xAxisDataKey: xAxisColumn,
    width: width,
    height: height,
    data: rechartsData,
    // and now your control data, manipulated as needed, and passed through as props!
    boldText: formData.boldText,
    headerFontSize: formData.headerFontSize,
    onBarClick,
    resetFilters,
    headerText: formData.headerText,
  };
}
