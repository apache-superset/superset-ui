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
  getMetricLabel,
  getNumberFormatter,
  NumberFormatter,
  t,
} from '@superset-ui/core';
import { EChartsOption, BarSeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { EchartsWaterfallFormData, EchartsWaterfallChartProps } from './types';
import { defaultGrid, defaultTooltip, defaultYAxis } from '../defaults';
import { EchartsProps } from '../types';

const TOTAL_MARK = '__TOTAL__';
const STACK_MARK = 'stack';

const LEGEND = {
  INCREASE: t('Increase'),
  DECREASE: t('Decrease'),
  TOTAL: t('Total'),
};

function formatTooltip({
  params,
  numberFormatter,
}: {
  params: any;
  numberFormatter: NumberFormatter;
}) {
  const increaseParams = params[1];
  const decreaseParams = params[2];
  const totalParams = params[3];

  const htmlMaker = (params: any) =>
    `
    <div>${params.name}</div>
    <div>
      ${params.marker}
      <span style="font-size:14px;color:#666;font-weight:400;margin-left:2px">${
        params.seriesName
      }: </span>
      <span style="float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900">${numberFormatter(
        params.value,
      )}</span>
    </div>
  `;

  if (increaseParams.value !== '-') {
    return htmlMaker(increaseParams);
  }
  if (decreaseParams.value !== '-') {
    return htmlMaker(decreaseParams);
  }
  if (totalParams.value !== '-') {
    return htmlMaker(totalParams);
  }
  return '';
}

function transformer(data: DataRecord[], breakdown: string, category: string, metric: string) {
  // Sort by period (ascending)
  const sortedData = data.sort(
    (a, b) =>
      Number.parseInt(a[breakdown] as string, 10) - Number.parseInt(b[breakdown] as string, 10),
  );

  // Group by period (temporary map)
  const groupedData = sortedData.reduce((acc, cur) => {
    const period = cur[breakdown] as string;
    const periodData = acc.get(period) || [];
    periodData.push(cur);
    acc.set(period, periodData);
    return acc;
  }, new Map<string, DataRecord[]>());

  let transformedData: DataRecord[] = [];
  let isFirstPeriod = true;
  groupedData.forEach((value, key) => {
    let tempValue = value;
    // Calc total per period
    const sum = tempValue.reduce((acc, cur) => acc + (cur[metric] as number), 0);
    // Push total per period to the end of period values array
    tempValue.push({
      [category]: key,
      [breakdown]: TOTAL_MARK,
      [metric]: sum,
    });
    // Remove first period and leave only last one
    if (isFirstPeriod) {
      const lastItem = tempValue[tempValue.length - 1];
      tempValue = [lastItem];
      isFirstPeriod = false;
    }
    transformedData = transformedData.concat(tempValue);
  });

  return transformedData;
}

export default function transformProps(chartProps: EchartsWaterfallChartProps): EchartsProps {
  const { width, height, formData, queriesData } = chartProps;
  const { data = [] } = queriesData[0];
  const {
    colorScheme,
    metric = '',
    breakdown,
    category,
    xTicksLayout,
    showLegend,
    yAxisLabel,
    xAxisLabel,
    yAxisFormat,
  } = formData as EchartsWaterfallFormData;
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(yAxisFormat);
  const formatter = (params: CallbackDataParams) => {
    const { value, seriesName } = params;
    let formattedValue = numberFormatter(value as number);
    if (seriesName === LEGEND.DECREASE) {
      formattedValue = `-${formattedValue}`;
    }
    return formattedValue;
  };

  const metricLabel = getMetricLabel(metric);

  const transformedData = transformer(data, breakdown, category, metricLabel);

  const assistData: (number | string)[] = [];
  const increaseData: (number | string)[] = [];
  const decreaseData: (number | string)[] = [];
  const totalData: (number | string)[] = [];

  transformedData.forEach((data, index, self) => {
    const totalSumUpToCur = self.slice(0, index + 1).reduce((prev, cur, i) => {
      // Ignore calculation on period column except first period
      if (cur[breakdown] !== TOTAL_MARK || i === 0) {
        return prev + (cur[metricLabel] as number);
      }
      return prev;
    }, 0);

    const value = data[metricLabel] as number;
    const isNegative = value < 0;
    if (data[breakdown] === TOTAL_MARK) {
      increaseData.push('-');
      decreaseData.push('-');
      assistData.push('-');
      totalData.push(totalSumUpToCur);
    } else if (isNegative) {
      increaseData.push('-');
      decreaseData.push(Math.abs(value));
      assistData.push(totalSumUpToCur);
      totalData.push('-');
    } else {
      increaseData.push(value);
      decreaseData.push('-');
      assistData.push(totalSumUpToCur - value);
      totalData.push('-');
    }
  });

  let axisLabel;
  if (xTicksLayout === '45°') axisLabel = { rotate: -45 };
  else if (xTicksLayout === '90°') axisLabel = { rotate: -90 };
  else if (xTicksLayout === 'flat') axisLabel = { rotate: 0 };
  else if (xTicksLayout === 'staggered') axisLabel = { rotate: -45 };
  else axisLabel = { show: true };

  const series: BarSeriesOption[] = [
    {
      name: 'assist',
      type: 'bar',
      stack: STACK_MARK,
      itemStyle: {
        borderColor: 'rgba(0,0,0,0)',
        color: 'rgba(0,0,0,0)',
      },
      emphasis: {
        itemStyle: {
          borderColor: 'rgba(0,0,0,0)',
          color: 'rgba(0,0,0,0)',
        },
      },
      data: assistData,
    },
    {
      name: LEGEND.INCREASE,
      type: 'bar',
      stack: STACK_MARK,
      label: {
        show: true,
        position: 'top',
        formatter,
      },
      itemStyle: {
        color: colorFn(LEGEND.INCREASE),
      },
      data: increaseData,
    },
    {
      name: LEGEND.DECREASE,
      type: 'bar',
      stack: STACK_MARK,
      label: {
        show: true,
        position: 'bottom',
        formatter,
      },
      itemStyle: {
        color: colorFn(LEGEND.DECREASE),
      },
      data: decreaseData,
    },
    {
      name: LEGEND.TOTAL,
      type: 'bar',
      stack: STACK_MARK,
      label: {
        show: true,
        position: 'top',
        formatter,
      },
      itemStyle: {
        color: colorFn(LEGEND.TOTAL),
      },
      data: totalData,
    },
  ];

  const echartOptions: EChartsOption = {
    grid: {
      ...defaultGrid,
      top: 30,
      bottom: 30,
      left: 20,
      right: 20,
    },
    legend: {
      show: showLegend,
      data: [LEGEND.INCREASE, LEGEND.DECREASE, LEGEND.TOTAL],
    },
    xAxis: {
      type: 'category',
      data: transformedData.map(row => row[category] as string),
      name: xAxisLabel,
      nameTextStyle: {
        padding: [15, 0, 0, 0],
      },
      nameLocation: 'middle',
      axisLabel,
    },
    yAxis: {
      ...defaultYAxis,
      type: 'value',
      nameTextStyle: {
        padding: [0, 0, 20, 0],
      },
      nameLocation: 'middle',
      name: yAxisLabel,

      axisLabel: { formatter: numberFormatter },
    },
    tooltip: {
      ...defaultTooltip,
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: any) =>
        formatTooltip({
          params,
          numberFormatter,
        }),
    },
    series,
  };

  return {
    width,
    height,
    echartOptions,
  };
}
