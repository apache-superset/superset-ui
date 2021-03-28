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
  DataRecordValue,
  getMetricLabel,
  getNumberFormatter,
  getTimeFormatter,
  NumberFormatter,
} from '@superset-ui/core';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { EChartsOption, RadarSeriesOption, RadarSeriesDataValue } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_PIE_FORM_DATA,
  EchartsRadarChartProps,
  EchartsRadarFormData,
  EchartsRadarLabelType,
  RadarChartTransformedProps,
} from './types';
import { DEFAULT_LEGEND_FORM_DATA } from '../types';
import { extractGroupbyLabel, getColtypesMapping, getLegendProps } from '../utils/series';
import { defaultGrid, defaultTooltip } from '../defaults';

export function formatLabel({
  params,
  labelType,
  numberFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsRadarLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name = '', value } = params;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsRadarLabelType.Value:
      return formattedValue;
    case EchartsRadarLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}

export default function transformProps(
  chartProps: EchartsRadarChartProps,
): RadarChartTransformedProps {
  const { formData, height, hooks, ownCurrentState, queriesData, width } = chartProps;
  const { data = [] } = queriesData.length > 0 ? queriesData[0] : {};
  const coltypeMapping = getColtypesMapping(queriesData[0]);

  const {
    colorScheme,
    groupby,
    labelType,
    labelPosition,
    legendOrientation,
    legendType,
    metrics = [],
    numberFormat,
    dateFormat,
    showLabels,
    showLegend,
    isCircle,
  }: EchartsRadarFormData = { ...DEFAULT_LEGEND_FORM_DATA, ...DEFAULT_PIE_FORM_DATA, ...formData };
  const metricsLabel = metrics.map(metric => getMetricLabel(metric));

  const keys = data.map(datum =>
    extractGroupbyLabel({
      datum,
      groupby,
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    }),
  );
  const labelMap = data.reduce((acc: Record<string, DataRecordValue[]>, datum) => {
    const label = extractGroupbyLabel({
      datum,
      groupby,
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    });
    return {
      ...acc,
      [label]: groupby.map(col => datum[col]),
    };
  }, {});

  const { setDataMask = () => {} } = hooks;

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);
  const formatter = (params: CallbackDataParams) =>
    formatLabel({
      params,
      numberFormatter,
      labelType,
    });

  const transformedData: RadarSeriesDataValue[] = data.map(datum => {
    const name = extractGroupbyLabel({
      datum,
      groupby,
      coltypeMapping,
      timeFormatter: getTimeFormatter(dateFormat),
    });

    return {
      value: metricsLabel.map(metricLabel => datum[metricLabel]),
      name,
      itemStyle: {
        color: colorFn(name),
      },
      label: {
        show: showLabels,
        position: labelPosition,
        formatter,
      },
    };
  });

  const selectedValues = (ownCurrentState.selectedValues || []).reduce(
    (acc: Record<string, number>, selectedValue: string) => {
      const index = transformedData.findIndex(({ name }) => name === selectedValue);
      return {
        ...acc,
        [index]: selectedValue,
      };
    },
    {},
  );

  const indicator = metricsLabel.map(metricLabel => ({
    name: metricLabel,
  }));

  const series: RadarSeriesOption[] = [
    {
      type: 'radar',
      animation: false,
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
    },
    legend: {
      ...getLegendProps(legendType, legendOrientation, showLegend),
      data: keys,
    },
    series,
    radar: {
      shape: isCircle ? 'circle' : 'polygon',
      indicator,
    },
  };

  return {
    formData,
    width,
    height,
    echartOptions,
    setDataMask,
    labelMap,
    groupby,
    selectedValues,
  };
}
