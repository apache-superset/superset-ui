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
/* eslint-disable camelcase */
import {
  AnnotationData,
  AnnotationLayer,
  ChartProps,
  CategoricalColorNamespace,
  getNumberFormatter,
  isEventAnnotationLayer,
  isFormulaAnnotationLayer,
  isIntervalAnnotationLayer,
  isTimeseriesAnnotationLayer,
  isTimeseriesAnnotationResult,
  smartDateVerboseFormatter,
  TimeseriesDataRecord,
} from '@superset-ui/core';
import { DEFAULT_FORM_DATA, EchartsTimeseriesFormData } from './types';
import { EchartsProps, ForecastSeriesEnum } from '../types';
import { parseYAxisBound } from '../utils/controls';
import { extractTimeseriesSeries } from '../utils/series';
import {
  evalFormula,
  extractRecordAnnotations,
  extractAnnotationLabels,
  formatAnnotationLabel,
  parseAnnotationOpacity,
} from '../utils/annotation';
import {
  extractForecastSeriesContext,
  extractProphetValuesFromTooltipParams,
  formatProphetTooltipSeries,
  rebaseTimeseriesDatum,
} from '../utils/prophet';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queryData } = chartProps;

  const {
    annotation_data: annotationData = {},
    data = [],
  }: { annotation_data?: AnnotationData; data?: TimeseriesDataRecord[] } = queryData;

  const {
    annotationLayers,
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
    truncateYAxis,
    yAxisFormat,
    yAxisBounds,
    zoomable,
  }: EchartsTimeseriesFormData = { ...DEFAULT_FORM_DATA, ...formData };

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const rebasedData = rebaseTimeseriesDatum(data);
  const rawSeries = extractTimeseriesSeries(rebasedData);
  const series: echarts.EChartOption.Series[] = [];
  const formatter = getNumberFormatter(contributionMode ? ',.0%' : yAxisFormat);

  rawSeries.forEach(entry => {
    const forecastSeries = extractForecastSeriesContext(entry.name || '');
    const isConfidenceBand =
      forecastSeries.type === ForecastSeriesEnum.ForecastLower ||
      forecastSeries.type === ForecastSeriesEnum.ForecastUpper;
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
        id: entry.name,
        name: forecastSeries.name,
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
          !isConfidenceBand &&
          (plotType === 'scatter' || (forecastEnabled && isObservation) || markerEnabled)
            ? markerSize
            : 0,
      });
  });

  annotationLayers.forEach((layer: AnnotationLayer) => {
    const {
      name,
      color,
      opacity: annotationOpacity,
      width: annotationWidth,
      show: annotationShow,
      style,
    } = layer;
    if (annotationShow) {
      if (isFormulaAnnotationLayer(layer)) {
        series.push({
          name,
          id: name,
          itemStyle: {
            color: color || colorFn(name),
          },
          lineStyle: {
            opacity: parseAnnotationOpacity(annotationOpacity),
            type: style,
            width: annotationWidth,
          },
          type: 'line',
          smooth: true,
          // @ts-ignore
          data: evalFormula(layer, data),
          symbolSize: 0,
          z: 0,
        });
      } else if (isIntervalAnnotationLayer(layer)) {
        const annotations = extractRecordAnnotations(layer, annotationData);
        annotations.forEach(annotation => {
          const { descriptions, intervalEnd, time, title } = annotation;
          const label = formatAnnotationLabel(name, title, descriptions);
          const intervalData = [
            [
              {
                name: label,
                xAxis: time,
              },
              {
                xAxis: intervalEnd,
              },
            ],
          ];
          series.push({
            id: `Interval - ${label}`,
            type: 'line',
            animation: false,
            markArea: {
              silent: false,
              itemStyle: {
                color: color || colorFn(name),
                opacity: parseAnnotationOpacity(annotationOpacity || 'opacityMedium'),
                emphasis: {
                  opacity: 0.8,
                },
              },
              label: {
                show: false,
                color: '#000000',
                emphasis: {
                  fontWeight: 'bold',
                  show: true,
                  position: 'insideTop',
                  verticalAlign: 'top',
                  backgroundColor: '#ffffff',
                },
              },
              // @ts-ignore
              data: intervalData,
            },
          });
        });
      } else if (isEventAnnotationLayer(layer) && annotationShow) {
        const annotations = extractRecordAnnotations(layer, annotationData);
        annotations.forEach(annotation => {
          const { descriptions, time, title } = annotation;
          const label = formatAnnotationLabel(name, title, descriptions);
          const eventData = [
            {
              name: label,
              xAxis: time,
            },
          ];
          series.push({
            id: `Event - ${label}`,
            type: 'line',
            animation: false,
            markLine: {
              silent: false,
              symbol: 'none',
              lineStyle: {
                width: annotationWidth,
                type: style,
                color: color || colorFn(name),
                opacity: parseAnnotationOpacity(annotationOpacity),
                emphasis: {
                  opacity: 1,
                },
              },
              label: {
                show: false,
                color: '#000000',
                position: 'insideEndTop',
                emphasis: {
                  // @ts-ignore
                  formatter: params => {
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                    return params.name;
                  },
                  // @ts-ignore
                  fontWeight: 'bold',
                  show: true,
                  backgroundColor: '#ffffff',
                },
              },
              // @ts-ignore
              data: eventData,
            },
          });
        });
      } else if (isTimeseriesAnnotationLayer(layer) && annotationShow) {
        const { showMarkers, hideLine } = layer;
        const result = annotationData[name];
        if (isTimeseriesAnnotationResult(result)) {
          result.forEach(annotation => {
            const { key, values } = annotation;
            series.push({
              type: 'line',
              id: key,
              name: key,
              data: values.map(row => [row.x, row.y] as [number | string, number]),
              symbolSize: showMarkers ? markerSize : 0,
              lineStyle: {
                opacity: parseAnnotationOpacity(annotationOpacity),
                type: style,
                width: hideLine ? 0 : annotationWidth,
              },
            });
          });
        }
      }
    }
  });

  // yAxisBounds need to be parsed to replace incompatible values with undefined
  let [min, max] = (yAxisBounds || []).map(parseYAxisBound);

  // default to 0-100% range when doing row-level contribution chart
  if (contributionMode === 'row' && stack) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
  }

  const echartOptions: echarts.EChartOption = {
    grid: {
      ...defaultGrid,
      top: 30,
      bottom: zoomable ? 80 : 0,
      left: 20,
      right: 20,
    },
    xAxis: { type: 'time' },
    yAxis: {
      ...defaultYAxis,
      type: logAxis ? 'log' : 'value',
      min,
      max,
      minorTick: { show: true },
      minorSplitLine: { show: minorSplitLine },
      axisLabel: { formatter },
      scale: truncateYAxis,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      formatter: params => {
        // @ts-ignore
        const rows = [`${smartDateVerboseFormatter(params[0].value[0])}`];
        // @ts-ignore
        const prophetValues = extractProphetValuesFromTooltipParams(params);
        Object.keys(prophetValues).forEach(key => {
          const value = prophetValues[key];
          rows.push(
            formatProphetTooltipSeries({
              ...value,
              seriesName: key,
              formatter,
            }),
          );
        });
        return rows.join('<br />');
      },
    },
    legend: {
      data: rawSeries
        .filter(
          entry =>
            extractForecastSeriesContext(entry.name || '').type === ForecastSeriesEnum.Observation,
        )
        .map(entry => entry.name || '')
        .concat(extractAnnotationLabels(annotationLayers, annotationData)),
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
            bottom: 20,
          },
        ]
      : [],
  };

  return {
    // @ts-ignore
    echartOptions,
    width,
    height,
  };
}
