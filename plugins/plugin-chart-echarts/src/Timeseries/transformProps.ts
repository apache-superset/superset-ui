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
    seriesType,
    logAxis,
    opacity,
    stack,
    markerEnabled,
    markerSize,
    minorSplitLine,
    zoomable,
  } = formData;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const rebasedData = rebaseTimeseriesDatum(queryData.data);
  const rawSeries = extractTimeseriesSeries(rebasedData);

  const series: echarts.EChartOption.Series[] = [];

  rawSeries.forEach(entry => {
    const forecastSeries = extractForecastSeriesContext(entry.name || '');
    let stackId;
    if (forecastSeries.type === ForecastSeriesEnum.Observation) {
      stackId = 'Total';
    } else {
      stackId = forecastSeries.name;
    }
    let plotType;
    if (forecastSeries.type === ForecastSeriesEnum.Observation) {
      plotType = 'scatter';
    } else {
      plotType = seriesType === 'bar' ? 'bar' : 'line';
    }
    const lineStyle = [ForecastSeriesEnum.ForecastLower, ForecastSeriesEnum.ForecastUpper].includes(
      forecastSeries.type,
    )
      ? { opacity: 0 }
      : {};

    series.push({
      ...entry,
      itemStyle: {
        color: colorFn(forecastSeries.name),
      },
      type: plotType,
      // @ts-ignore
      smooth: seriesType === 'smooth',
      step: ['start', 'middle', 'end'].includes(seriesType as string) ? seriesType : undefined,
      stack:
        stack ||
        [ForecastSeriesEnum.ForecastLower, ForecastSeriesEnum.ForecastUpper].includes(
          forecastSeries.type,
        )
          ? stackId
          : undefined,
      lineStyle,
      areaStyle: {
        opacity: forecastSeries.type === ForecastSeriesEnum.ForecastUpper || area ? opacity : 0,
      },
      symbolSize:
        forecastSeries.type === ForecastSeriesEnum.Observation || markerEnabled ? markerSize : 0,
    });
  });
  const xAxis: echarts.EChartOption.XAxis = { type: 'time' };
  const yAxis: echarts.EChartOption.YAxis = {
    type: logAxis ? 'log' : 'value',
    min: contributionMode === 'row' && stack ? 0 : undefined,
    max: contributionMode === 'row' && stack ? 1 : undefined,
    minorTick: { show: true },
    minorSplitLine: { show: minorSplitLine },
    axisLabel: contributionMode ? { formatter: getNumberFormatter(',.0%') } : {},
  };
  const tooltip: {
    trigger?: 'none' | 'item' | 'axis';
  } = {
    trigger: 'axis',
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
