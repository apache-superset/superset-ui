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
import { ChartProps, DataRecordValue } from '@superset-ui/chart';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { getNumberFormatter } from '@superset-ui/number-format';
import { EchartsTimeseriesRawDatum, TimestampType, EchartsLineProps } from '../types';

export default function transformProps(chartProps: ChartProps & EchartsLineProps) {
  /**
   * This function is called after a successful response has been
   * received from the chart data endpoint, and is used to transform
   * the incoming data prior to being sent to the Visualization.
   *
   * The transformProps function is also quite useful to return
   * additional/modified props to your data viz component. The formData
   * can also be accessed from your EchartsTimeseries.tsx file, but
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
  const { width, height, formData, queryData } = chartProps;
  const {
    area,
    colorScheme,
    contributionMode,
    seriesType,
    logAxis,
    opacity,
    stack,
    markerEnabled,
    markerSize,
    minorSplitLine,
    zoomable,
  } = formData;

  let data = queryData.data as EchartsTimeseriesRawDatum[];
  data = data.map((item: { __timestamp: TimestampType }) => ({
    ...item,
    // convert epoch to native Date
    // eslint-disable-next-line no-underscore-dangle
    __timestamp: new Date(item.__timestamp),
  }));

  // console.log('formData via TransformProps.ts', formData);

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  const series = [] as unknown[];

  const keys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== '__timestamp') : [];

  const rawSeries: Record<string, [Date, DataRecordValue][]> = keys.reduce(
    (obj, key) => ({
      ...obj,
      [key]: [],
    }),
    {},
  );

  data.forEach(row => {
    // eslint-disable-next-line no-underscore-dangle
    const timestamp = row.__timestamp;
    keys.forEach(key => {
      rawSeries[key].push([timestamp as Date, area ? row[key] || 0 : row[key]]);
    });
  });

  Object.entries(rawSeries).forEach(([key, value]) => {
    series.push({
      color: colorFn(key),
      name: key,
      data: value,
      type: seriesType === 'bar' ? 'bar' : 'line',
      smooth: seriesType === 'smooth',
      step: ['start', 'middle', 'end'].includes(seriesType as string) ? seriesType : undefined,
      stack: stack ? 'Total' : undefined,
      areaStyle: area ? { opacity } : undefined,
      symbolSize: markerEnabled ? markerSize : 0,
    });
  });

  const echartOptions = {
    grid: {
      top: 60,
      bottom: zoomable ? 100 : 60,
      left: 40,
      right: 40,
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: logAxis ? 'log' : 'value',
      min: contributionMode === 'row' && stack ? 0 : undefined,
      max: contributionMode === 'row' && stack ? 1 : undefined,
      minorTick: { show: true },
      minorSplitLine: { show: minorSplitLine },
      axisLabel: contributionMode ? { formatter: getNumberFormatter(',.0%') } : {},
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: keys,
    },
    series,
    toolbox: {
      show: zoomable,
      feature: {
        dataZoom: {
          yAxisIndex: false,
          title: {
            zoom: 'zoom area',
            back: 'restore zoom',
          },
        },
      },
    },
    dataZoom: [
      {
        show: zoomable,
        type: 'slider',
        start: 0,
        end: 100,
      },
    ],
  };

  return {
    area,
    colorScheme,
    contributionMode,
    echartOptions,
    seriesType,
    logAxis,
    opacity,
    stack,
    markerEnabled,
    markerSize,
    minorSplitLine,
    width,
    height,
    data,
    // and now your control data, manipulated as needed, and passed through as props!
  };
}
