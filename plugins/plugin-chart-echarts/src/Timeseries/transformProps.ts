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
    forecastEnabled,
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
        itemStyle: {
          color: colorFn(forecastSeries.name),
        },
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
          !isConfidenceBand && (plotType === 'scatter' || isObservation || markerEnabled)
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
