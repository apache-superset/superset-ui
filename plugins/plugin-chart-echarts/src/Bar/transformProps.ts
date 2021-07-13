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
  CategoricalColorNamespace,
  DataRecord,
  TimeseriesDataRecord,
  getNumberFormatter,
  getMetricLabel,
  getTimeFormatter,
  smartDateFormatter,
  smartDateDetailedFormatter,
  TimeFormatter,
} from '@superset-ui/core';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { BarDataItemOption } from 'echarts/types/src/chart/bar/BarSeries';
import {
  DEFAULT_BAR_FORM_DATA,
  EchartsBarFormData,
  EchartsBarChartProps,
  BarChartTransformedProps,
} from './types';
import {
  extractGroupbyLabel,
  getLegendProps,
  extractTimeseriesSeries,
  getChartPadding,
  dedupSeries,
} from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';
import { TIMESERIES_CONSTANTS } from '../constants';
import { LegendOrientation, ProphetValue } from '../types';
import { formatProphetTooltipSeries, rebaseTimeseriesDatum } from '../utils/prophet';

export function getTimeseriesTooltipFormatter(format?: string): TimeFormatter | StringConstructor {
  if (format === smartDateFormatter.id) {
    return smartDateDetailedFormatter;
  }
  if (format) {
    return getTimeFormatter(format);
  }
  return String;
}

export function getTimeseriesXAxisFormatter(
  format?: string,
): TimeFormatter | StringConstructor | undefined {
  if (format === smartDateFormatter.id || !format) {
    return undefined;
  }
  if (format) {
    return getTimeFormatter(format);
  }
  return String;
}

export const extractProphetValuesFromTimeseriesTooltipParams = (
  params: (CallbackDataParams & { seriesName: string })[],
): Record<string, ProphetValue> => {
  const values: Record<string, ProphetValue> = {};
  params.forEach(param => {
    const { marker, seriesName, value } = param;
    const context = { name: seriesName };
    const numericValue = (value as [Date, number])[1];
    if (numericValue) {
      if (!(context.name in values))
        values[context.name] = {
          marker: marker || '',
        };
      const prophetValues = values[context.name];
      prophetValues.observation = numericValue;
    }
  });
  return values;
};

export const extractProphetValuesFromTooltipParams = (
  params: (CallbackDataParams & { seriesName: string })[],
): Record<string, ProphetValue> => {
  const values: Record<string, ProphetValue> = {};
  params.forEach(param => {
    const { marker, seriesName, value } = param;
    const context = { name: seriesName };
    const numericValue = value as number;
    if (numericValue) {
      if (!(context.name in values))
        values[context.name] = {
          marker: marker || '',
        };
      const prophetValues = values[context.name];
      prophetValues.observation = numericValue;
    }
  });
  return values;
};

export function transformTimeseriesBarProps(
  chartProps: EchartsBarChartProps,
): BarChartTransformedProps {
  const { width, height, formData, queriesData } = chartProps;
  const {
    colorScheme,
    legendType,
    legendOrientation,
    showLegend,
    legendMargin,
    xAxisTimeFormat,
    yAxisFormat,
  }: EchartsBarFormData = { ...DEFAULT_BAR_FORM_DATA, ...formData };
  const data = (queriesData[0]?.data || []) as TimeseriesDataRecord[];
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const rebasedData = rebaseTimeseriesDatum(data);
  const rawSeries = extractTimeseriesSeries(rebasedData, {});
  const padding = getChartPadding(showLegend, legendOrientation, legendMargin, {
    top: TIMESERIES_CONSTANTS.gridOffsetTop,
    bottom: TIMESERIES_CONSTANTS.gridOffsetBottom,
    left: TIMESERIES_CONSTANTS.gridOffsetLeft,
    right:
      showLegend && legendOrientation === LegendOrientation.Right
        ? 0
        : TIMESERIES_CONSTANTS.gridOffsetRight,
  });

  const formatter = getNumberFormatter(yAxisFormat);
  const tooltipFormatter = getTimeseriesTooltipFormatter(xAxisTimeFormat);

  // @ts-ignore
  const series: BarSeriesOption[] = rawSeries.map((raw, rawIndex) => {
    const { name, data } = raw;
    return {
      name,
      type: 'bar',
      data: (data as BarDataItemOption[]).map(value => ({
        value,
        itemStyle: {
          color: colorFn(rawIndex),
        },
      })),
    };
  });

  const echartOptions: EChartsOption = {
    useUTC: true,
    grid: {
      ...defaultGrid,
      ...padding,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      formatter: (params: any) => {
        const value: number = params[0].value[0];
        const prophetValue = params;
        const rows: Array<string> = [`${tooltipFormatter(value)}`];
        const prophetValues: Record<
          string,
          ProphetValue
        > = extractProphetValuesFromTimeseriesTooltipParams(prophetValue);

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
      ...getLegendProps(legendType, legendOrientation, showLegend, true),
      // @ts-ignore
      data: rawSeries.map((raw, rawIndex) => {
        const { name } = raw;
        return {
          name,
          itemStyle: {
            color: colorFn(rawIndex),
          },
        };
      }),
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: getTimeseriesXAxisFormatter(xAxisTimeFormat),
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter,
      },
    },
    series: dedupSeries(series),
  };

  return {
    width,
    height,
    echartOptions,
  };
}

export function transformBarProps(chartProps: EchartsBarChartProps): BarChartTransformedProps {
  const { width, height, formData, queriesData } = chartProps;
  const {
    groupby,
    metrics = [],
    colorScheme,
    yAxisFormat,
    legendType,
    showLegend,
    legendOrientation,
    legendMargin,
  }: EchartsBarFormData = { ...DEFAULT_BAR_FORM_DATA, ...formData };
  const data = (queriesData[0]?.data || []) as DataRecord[];
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const metricLabels = metrics.map(getMetricLabel);
  const padding = getChartPadding(showLegend, legendOrientation, legendMargin);
  const formatter = getNumberFormatter(yAxisFormat);

  // @ts-ignore
  const series: BarSeriesOption[] = metricLabels.map((metricLabel, metricLabelIndex) => ({
    name: metricLabel,
    type: 'bar',
    data: data.map((datum: DataRecord, datumIndex) => ({
      name: `${metricLabel} ${datumIndex}`,
      value: datum[metricLabel],
      itemStyle: {
        color: colorFn(metricLabelIndex),
      },
    })),
  }));

  const echartOptions: EChartsOption = {
    grid: {
      ...defaultGrid,
      ...padding,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      formatter: (params: any) => {
        const { axisValueLabel } = params[0];
        const prophetValue = params;
        const rows: Array<string> = [axisValueLabel];
        const prophetValues: Record<string, ProphetValue> = extractProphetValuesFromTooltipParams(
          prophetValue,
        );

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
      ...getLegendProps(legendType, legendOrientation, showLegend, true),
      // @ts-ignore
      data: series.map((raw, rawIndex) => {
        const { name } = raw;
        return {
          name,
          itemStyle: {
            color: colorFn(rawIndex),
          },
        };
      }),
    },
    xAxis: {
      type: 'category',
      data: data.map(datum => extractGroupbyLabel({ datum, groupby, coltypeMapping: {} })),
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter,
      },
    },
    series,
  };

  return {
    width,
    height,
    echartOptions,
  };
}

export default function transformProps(chartProps: EchartsBarChartProps): BarChartTransformedProps {
  const { formData } = chartProps;
  const { timeseries } = formData;
  if (timeseries) {
    return transformTimeseriesBarProps(chartProps);
  }
  return transformBarProps(chartProps);
}
