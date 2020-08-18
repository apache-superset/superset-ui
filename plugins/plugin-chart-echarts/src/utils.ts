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
import { NumberFormatter } from '@superset-ui/number-format';
import { DataRecordValue } from '@superset-ui/chart';
import { EchartsBaseTimeseriesSeries, EchartsTimeseriesDatum } from './Timeseries/types';
import { ForecastSeriesContext, ForecastSeriesEnum, ProphetValue } from './types';

export const extractTimeseriesSeries = (
  data: EchartsTimeseriesDatum[],
): Partial<echarts.EChartOption.Series>[] => {
  const series = [] as EchartsBaseTimeseriesSeries[];

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
    const timestamp = new Date(row.__timestamp);
    keys.forEach(key => {
      rawSeries[key].push([timestamp, row[key]]);
    });
  });

  Object.entries(rawSeries).forEach(([key, value]) => {
    series.push({
      name: key,
      data: value,
    });
  });

  // @ts-ignore
  return series;
};

const seriesTypeRegex = new RegExp(
  `(.+)(${ForecastSeriesEnum.ForecastLower}|${ForecastSeriesEnum.ForecastTrend}|${ForecastSeriesEnum.ForecastUpper})$`,
);
export const extractForecastSeriesContext = (seriesName: string): ForecastSeriesContext => {
  const regexMatch = seriesTypeRegex.exec(seriesName);
  if (!regexMatch) return { name: seriesName, type: ForecastSeriesEnum.Observation };
  return {
    name: regexMatch[1],
    type: regexMatch[2] as ForecastSeriesEnum,
  };
};

export const extractSeriesBase = (series: echarts.EChartOption.Series[]): number | null => {
  let minValue: number | null = null;
  series
    .filter(row => row !== undefined)
    .forEach(seriesEntry => {
      if (seriesEntry?.data) {
        // @ts-ignore
        seriesEntry.data.forEach(row => {
          minValue =
            minValue === null || minValue === undefined || row[1] < minValue ? row[1] : minValue;
        });
      }
    });
  return minValue;
};

export const rebaseTimeseriesDatum = (data: EchartsTimeseriesDatum[]): EchartsTimeseriesDatum[] => {
  const keys = data.length > 0 ? Object.keys(data[0]) : [];

  return data.map(row => {
    const newRow: EchartsTimeseriesDatum = { __timestamp: '' };
    keys.forEach(key => {
      const forecastContext = extractForecastSeriesContext(key);
      const lowerKey = `${forecastContext.name}${ForecastSeriesEnum.ForecastLower}`;
      let value = row[key];
      if (
        forecastContext.type === ForecastSeriesEnum.ForecastUpper &&
        keys.includes(lowerKey) &&
        value !== null &&
        row[lowerKey] !== null
      ) {
        // @ts-ignore
        value -= row[lowerKey];
      }
      newRow[key] = value;
    });
    return newRow;
  });
};

export const extractProphetValuesFromTooltipParams = (
  params: (echarts.EChartOption.Tooltip.Format & { seriesId: string })[],
): Record<string, ProphetValue> => {
  const values: Record<string, ProphetValue> = {};
  params.forEach(param => {
    const { marker, seriesId, value } = param;
    const context = extractForecastSeriesContext(seriesId);
    const numericValue = (value as [Date, number])[1];
    if (numericValue) {
      if (!(context.name in values))
        values[context.name] = {
          marker: marker || '',
        };
      const prophetValues = values[context.name];
      if (context.type === ForecastSeriesEnum.Observation) prophetValues.observation = numericValue;
      if (context.type === ForecastSeriesEnum.ForecastTrend)
        prophetValues.forecastTrend = numericValue;
      if (context.type === ForecastSeriesEnum.ForecastLower)
        prophetValues.forecastLower = numericValue;
      if (context.type === ForecastSeriesEnum.ForecastUpper)
        prophetValues.forecastUpper = numericValue;
    }
  });
  return values;
};

export const formatProphetTooltipSeries = ({
  seriesName,
  observation,
  forecastTrend,
  forecastLower,
  forecastUpper,
  marker,
  formatter,
}: ProphetValue & {
  seriesName: string;
  marker: string;
  formatter: NumberFormatter;
}): string => {
  let row = `${marker}${seriesName}: `;
  let isObservation = false;
  if (observation) {
    isObservation = true;
    row += `${formatter(observation)}`;
  }
  if (forecastTrend) {
    if (isObservation) row += ', ';
    row += `ŷ = ${formatter(forecastTrend)}`;
    if (forecastLower && forecastUpper)
      // the lower bound needs to be added to the upper bound
      row += ` (${formatter(forecastLower)}, ${formatter(forecastLower + forecastUpper)})`;
  }
  return `${row.trim()}`;
};
