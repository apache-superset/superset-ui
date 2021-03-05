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
import {
  QueryFormMetric,
  ChartProps,
  CategoricalColorNamespace,
  CategoricalColorScale,
  DataRecord,
  getNumberFormatter,
  getMetricLabel,
} from '@superset-ui/core';
import { EChartsOption, GaugeSeriesOption } from 'echarts';
import { GaugeDataItemOption } from 'echarts/types/src/chart/gauge/GaugeSeries';
import { parseNumbersList } from '../utils/controls';
import {
  DEFAULT_FORM_DATA as DEFAULT_GAUGE_FORM_DATA,
  EchartsGaugeFormData,
  AxisTickLineStyle,
} from './types';
import {
  DEFAULT_GAUGE_SERIES_OPTION,
  INTERVAL_GAUGE_SERIES_OPTION,
  TICKS_DISTANCE_FROM_LINE,
  TITLE_OFFSET_FROM_CENTER,
} from './constants';

const setIntervalBoundsAndColors = (
  intervals: string,
  intervalColorIndices: string,
  colorFn: CategoricalColorScale,
  normalizer: number,
): Array<[number, string]> => {
  let intervalBoundsNonNormalized;
  let intervalColorIndicesArray;
  try {
    intervalBoundsNonNormalized = parseNumbersList(intervals, ',');
    intervalColorIndicesArray = parseNumbersList(intervalColorIndices, ',');
  } catch (error) {
    intervalBoundsNonNormalized = [] as number[];
    intervalColorIndicesArray = [] as number[];
  }

  const intervalBounds = intervalBoundsNonNormalized.map(bound => bound / normalizer);
  const intervalColors = intervalColorIndicesArray.map(ind => colorFn.colors[ind - 1]);

  return intervalBounds.map((val, idx) => {
    const color = intervalColors[idx];
    return [val, color || colorFn.colors[idx]];
  });
};

const calculateAxisLineWidth = (data: DataRecord[], fontSize: number, overlap: boolean): number =>
  overlap ? fontSize : data.length * fontSize;

export default function transformProps(chartProps: ChartProps) {
  const { width, height, formData, queriesData } = chartProps;
  const {
    groupby,
    metric,
    minVal,
    maxVal,
    colorScheme,
    fontSize,
    numberFormat,
    animation,
    showProgress,
    overlap,
    roundcap,
    showAxisTick,
    showSplitLine,
    splitNumber,
    startAngle,
    endAngle,
    showPointer,
    intervals,
    intervalColorIndices,
    valueFormatter,
  }: EchartsGaugeFormData = { ...DEFAULT_GAUGE_FORM_DATA, ...formData };
  const data = (queriesData[0]?.data || []) as DataRecord[];
  const numberFormatter = getNumberFormatter(numberFormat);
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const normalizer = maxVal;
  const axisLineWidth = calculateAxisLineWidth(data, fontSize, overlap);
  const axisTickLength = fontSize / 4;
  const splitLineLength = fontSize;
  const titleOffsetFromTitle = 2 * fontSize;
  const detailOffsetFromTitle = 0.9 * fontSize;
  const detailFontSize = 1.2 * fontSize;
  const intervalBoundsAndColors = setIntervalBoundsAndColors(
    intervals,
    intervalColorIndices,
    colorFn,
    normalizer,
  );
  const transformedData: GaugeDataItemOption[] = data.map((data_point, index) => ({
    value: data_point[getMetricLabel(metric as QueryFormMetric)] as number,
    name: groupby.map(column => `${column}: ${data_point[column]}`).join(),
    itemStyle: {
      color: colorFn(index),
    },
    title: {
      offsetCenter: ['0%', `${index * titleOffsetFromTitle + TITLE_OFFSET_FROM_CENTER}%`],
      fontSize,
    },
    detail: {
      offsetCenter: [
        '0%',
        `${index * titleOffsetFromTitle + TITLE_OFFSET_FROM_CENTER + detailOffsetFromTitle}%`,
      ],
      fontSize: detailFontSize,
    },
  }));

  const formatValue = (value: number) => valueFormatter.replace('{value}', numberFormatter(value));

  const progress = {
    show: showProgress,
    overlap,
    roundCap: roundcap,
    width: fontSize,
  };
  const splitLine = {
    show: showSplitLine,
    distance: -axisLineWidth - splitLineLength - TICKS_DISTANCE_FROM_LINE,
    length: splitLineLength,
    lineStyle: {
      width: fontSize / 4,
      color: DEFAULT_GAUGE_SERIES_OPTION.splitLine?.lineStyle?.color,
    },
  };
  const axisLine = {
    roundCap: roundcap,
    lineStyle: {
      width: axisLineWidth,
      color: DEFAULT_GAUGE_SERIES_OPTION.axisLine?.lineStyle?.color,
    },
  };
  const axisLabel = {
    distance: axisLineWidth - fontSize - 1.5 * splitLineLength - TICKS_DISTANCE_FROM_LINE,
    fontSize,
    formatter: numberFormatter,
    color: DEFAULT_GAUGE_SERIES_OPTION.axisLabel?.color,
  };
  const axisTick = {
    show: showAxisTick,
    distance: -axisLineWidth - axisTickLength - TICKS_DISTANCE_FROM_LINE,
    length: axisTickLength,
    lineStyle: DEFAULT_GAUGE_SERIES_OPTION.axisTick?.lineStyle as AxisTickLineStyle,
  };
  const detail = {
    valueAnimation: animation,
    formatter: (value: number) => formatValue(value),
    color: DEFAULT_GAUGE_SERIES_OPTION.detail?.color,
  };
  let pointer;

  if (intervalBoundsAndColors.length) {
    splitLine.lineStyle.color = INTERVAL_GAUGE_SERIES_OPTION.splitLine?.lineStyle?.color;
    axisTick.lineStyle.color = INTERVAL_GAUGE_SERIES_OPTION?.axisTick?.lineStyle?.color as string;
    axisLabel.color = INTERVAL_GAUGE_SERIES_OPTION.axisLabel?.color;
    axisLine.lineStyle.color = intervalBoundsAndColors;
    pointer = {
      show: showPointer,
      itemStyle: INTERVAL_GAUGE_SERIES_OPTION.pointer?.itemStyle,
    };
  } else {
    pointer = {
      show: showPointer,
    };
  }

  const series: GaugeSeriesOption[] = [
    {
      type: 'gauge',
      startAngle,
      endAngle,
      min: minVal,
      max: maxVal,
      progress,
      animation,
      axisLine: axisLine as GaugeSeriesOption['axisLine'],
      splitLine,
      splitNumber,
      axisLabel,
      axisTick,
      pointer,
      detail,
      data: transformedData,
    },
  ];

  const echartOptions: EChartsOption = {
    series,
  };

  return {
    width,
    height,
    echartOptions,
  };
}
