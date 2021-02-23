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
  ChartProps,
  DataRecord,
  getMetricLabel,
  getNumberFormatter,
  getTimeFormatter,
  NumberFormats,
  NumberFormatter,
} from '@superset-ui/core';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { EChartsOption, PieSeriesOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA,
  EchartsPieFormData,
  EchartsPieLabelType,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA, EchartsProps } from '../types';
import { extractGroupbyLabel, getChartPadding, getLegendProps } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

const formatName = (name: string, formatter: Function): string => {
  const date = new Date(name);

  if (!Number.isNaN(date.valueOf())) {
    return formatter(name);
  }

  return name;
};

export function formatPieLabel({
  params,
  labelType,
  numberFormatter,
  nameFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsPieLabelType;
  numberFormatter: NumberFormatter;
  nameFormatter?: Function;
}): string {
  const { name = '', value, percent } = params;
  const formattedValue = numberFormatter(value as number);
  const formattedPercent = percentFormatter((percent as number) / 100);
  const formatterName = nameFormatter ? formatName(name, nameFormatter) : name;

  switch (labelType) {
    case EchartsPieLabelType.Key:
      return formatterName;
    case EchartsPieLabelType.Value:
      return formattedValue;
    case EchartsPieLabelType.Percent:
      return formattedPercent;
    case EchartsPieLabelType.KeyValue:
      return `${formatterName}: ${formattedValue}`;
    case EchartsPieLabelType.KeyValuePercent:
      return `${formatterName}: ${formattedValue} (${formattedPercent})`;
    case EchartsPieLabelType.KeyPercent:
      return `${formatterName}: ${formattedPercent}`;
    default:
      return formatterName;
  }
}

export default function transformProps(chartProps: ChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const data: DataRecord[] = queriesData[0].data || [];

  const {
    colorScheme,
    donut,
    groupby,
    innerRadius,
    labelsOutside,
    labelLine,
    labelType,
    legendMargin,
    legendOrientation,
    legendType,
    metric = '',
    numberFormat,
    dateFormat,
    outerRadius,
    showLabels,
    showLegend,
  }: EchartsPieFormData = { ...DEFAULT_LEGEND_FORM_DATA, ...DEFAULT_PIE_FORM_DATA, ...formData };
  const metricLabel = getMetricLabel(metric);

  const keys = data.map(datum => extractGroupbyLabel({ datum, groupby }));
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);

  const transformedData: PieSeriesOption[] = data.map(datum => {
    const name = extractGroupbyLabel({ datum, groupby });
    return {
      value: datum[metricLabel],
      name,
      itemStyle: {
        color: colorFn(name),
      },
    };
  });

  const nameFormatter = dateFormat !== 'smart_date' && getTimeFormatter(dateFormat);
  const formatter = (params: CallbackDataParams) =>
    formatPieLabel({
      params,
      numberFormatter,
      labelType,
      ...(nameFormatter && { nameFormatter }),
    });

  const defaultLabel = {
    formatter,
    show: showLabels,
    color: '#000000',
  };

  const series: PieSeriesOption[] = [
    {
      type: 'pie',
      ...getChartPadding(showLegend, legendOrientation, legendMargin),
      animation: false,
      radius: [`${donut ? innerRadius : 0}%`, `${outerRadius}%`],
      center: ['50%', '50%'],
      avoidLabelOverlap: true,
      labelLine: labelsOutside && labelLine ? { show: true } : { show: false },
      label: labelsOutside
        ? {
            ...defaultLabel,
            position: 'outer',
            alignTo: 'none',
            bleedMargin: 5,
          }
        : {
            ...defaultLabel,
            position: 'inner',
          },
      emphasis: {
        label: {
          show: true,
          fontWeight: 'bold',
          backgroundColor: 'white',
        },
      },
      data: transformedData,
    },
  ];

  const echartOptions: EChartsOption = {
    grid: {
      ...defaultGrid,
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'item',
      formatter: (params: any) =>
        formatPieLabel({
          params,
          numberFormatter,
          labelType: EchartsPieLabelType.KeyValuePercent,
        }),
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: keys,
    },
    series,
  };

  return {
    width,
    height,
    echartOptions,
  };
}
