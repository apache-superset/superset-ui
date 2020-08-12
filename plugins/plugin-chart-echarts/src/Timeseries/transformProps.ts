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
import { ChartProps } from '@superset-ui/chart';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { getNumberFormatter } from '@superset-ui/number-format';
import { smartDateVerboseFormatter } from '@superset-ui/time-format';
import { EchartsTimeseriesProps } from './types';
import { ForecastSeriesEnum } from '../types';
import {
  extractForecastSeriesContext,
  extractTimeseriesSeries,
  rebaseTimeseriesDatum,
} from '../utils';

export default function transformProps(chartProps: ChartProps): EchartsTimeseriesProps {
  const { width, height, formData, queryData } = chartProps;
  const {
    area,
    colorScheme,
    contributionMode,
    forecastEnabled,
    seriesType,
    logAxis,
    opacity,
    stack,
    markerEnabled,
    markerSize,
    minorSplitLine,
    yAxisFormat,
    zoomable,
  } = formData;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const rebasedData = rebaseTimeseriesDatum(queryData.data);
  const rawSeries = extractTimeseriesSeries(rebasedData);

  const series: echarts.EChartOption.Series[] = [];
  const formatter = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat);
  console.log(smartDateVerboseFormatter(new Date()));

  rawSeries.forEach(entry => {
    const forecastSeries = extractForecastSeriesContext(entry.name || '');
    const isConfidenceBand = [
      ForecastSeriesEnum.ForecastLower,
      ForecastSeriesEnum.ForecastUpper,
    ].includes(forecastSeries.type);
    const isObservation = forecastSeries.type === ForecastSeriesEnum.Observation;
    const isTrend = forecastSeries.type === ForecastSeriesEnum.ForecastTrend;
    let stackId;
    if (isConfidenceBand) {
      stackId = forecastSeries.name;
    } else if (stack && isObservation) {
      // the suffix of the observation series is '' (falsy), which disables
      // stacking. Therefore we need to set something that is truthy.
      stackId = 'obs';
    } else if (stack && isTrend) {
      stackId = forecastSeries.type;
    }
    let plotType;
    if (!isConfidenceBand && (seriesType === 'scatter' || (forecastEnabled && isObservation))) {
      plotType = 'scatter';
    } else if (isConfidenceBand) {
      plotType = 'line';
    } else {
      plotType = seriesType === 'bar' ? 'bar' : 'line';
    }
    const lineStyle = isConfidenceBand ? { opacity: 0 } : {};

    if (!((stack || area) && isConfidenceBand))
      series.push({
        ...entry,
        name: forecastSeries.name,
        itemStyle: {
          color: colorFn(forecastSeries.name),
        },
        formatter,
        type: plotType,
        // @ts-ignore
        smooth: seriesType === 'smooth',
        step: ['start', 'middle', 'end'].includes(seriesType as string) ? seriesType : undefined,
        stack: stackId,
        lineStyle,
        areaStyle: {
          opacity: forecastSeries.type === ForecastSeriesEnum.ForecastUpper || area ? opacity : 0,
        },
        symbolSize:
          !isConfidenceBand &&
          (plotType === 'scatter' || (forecastEnabled && isObservation) || markerEnabled)
            ? markerSize
            : 0,
      });
  });
  const xAxis: echarts.EChartOption.XAxis = { type: 'time' };
  const yAxis: echarts.EChartOption.YAxis = {
    type: logAxis ? 'log' : 'value',
    min: contributionMode === 'row' && stack ? 0 : undefined,
    max: contributionMode === 'row' && stack ? 1 : undefined,
    minorTick: { show: true },
    minorSplitLine: { show: minorSplitLine },
    axisLabel: { formatter },
  };
  const tooltip: {
    trigger?: 'none' | 'item' | 'axis';
  } = {
    trigger: 'axis',
    formatter: (params: Record<string, any>, ticket, callback) => {
      let res = `${smartDateVerboseFormatter(params[0].value[0])}<br />`;
      const processedSeries: string[] = [];
      params.forEach((item, idx) => {
        if (!processedSeries.includes(item.seriesName)) {
          processedSeries.push(item.seriesName);
          res += `${params[idx].marker}`;
          if (
            idx === params.length - 1 ||
            (idx + 1 < params.length && params[idx + 1].seriesName !== item.seriesName)
          ) {
            // only observation
            res += `${params[idx].seriesName}: ${formatter(params[idx].value[1])}<br/>`;
          } else if (idx + 3 <= params.length && params[idx + 3].seriesName === item.seriesName) {
            // observation, prediction and confidence band
            res += `${params[idx].seriesName}: `;
            if (params[idx + 3].value[1]) res += `${formatter(params[idx + 3].value[1])}, `;
            res += `ŷ = ${formatter(params[idx].value[1])} `;
            res += `(${formatter(params[idx + 1].value[1])}, ${formatter(
              params[idx + 1].value[1] + params[idx + 2].value[1],
            )})<br/>`;
          } else if (idx + 1 <= params.length && params[idx + 1].seriesName === item.seriesName) {
            // prediction and observation
            res += `${params[idx].seriesName}: ${formatter(
              params[idx + 1].value[1],
            )}, ŷ = ${formatter(params[idx].value[1])}<br/>`;
          }
        }
      });
      setTimeout(() => {
        callback(ticket, res);
      }, 100);
      return 'loading';
    },
  };

  const echartOptions = {
    grid: {
      top: 60,
      bottom: zoomable ? 100 : 60,
      left: 40,
      right: 40,
    },
    xAxis,
    yAxis,
    tooltip,
    legend: {
      data: rawSeries
        .filter(
          entry =>
            extractForecastSeriesContext(entry.name || '').type === ForecastSeriesEnum.Observation,
        )
        .map(entry => entry.name || ''),
      right: zoomable ? 80 : 'auto',
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
    dataZoom: zoomable
      ? [
          {
            type: 'slider',
            start: 0,
            end: 100,
            bottom: 30,
          },
        ]
      : [],
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
  };
}
