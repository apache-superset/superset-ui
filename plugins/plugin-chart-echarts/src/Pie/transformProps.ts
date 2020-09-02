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
import { EchartsPieProps, PieChartFormData } from './types';
import { extractGroupbyLabel } from '../utils/series';
import { ChartProps, DataRecord } from '@superset-ui/chart';
import { convertMetric } from '@superset-ui/query';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { getNumberFormatter } from '@superset-ui/number-format';
import { formatPieLabel } from '../utils/formatters';

export default function transformProps(chartProps: ChartProps): EchartsPieProps {
  const { width, height, formData, queryData } = chartProps;
  const data: DataRecord[] = queryData.data || [];

  const {
    colorScheme,
    donut = false,
    groupby = [],
    innerRadius = 40,
    labelsOutside = true,
    metric = undefined,
    numberFormat,
    outerRadius = 80,
    pieLabelType = 'value',
    showLabels = true,
    showLegend = false,
  } = formData as PieChartFormData;
  if (metric === undefined) throw new Error('metric must be defined');
  const { label: metricLabel } = convertMetric(metric);

  const keys = data.map(datum => extractGroupbyLabel(datum, groupby));
  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);

  const transformedData = data.map(datum => {
    const name = extractGroupbyLabel(datum, groupby);
    return {
      value: datum[metricLabel],
      name,
      itemStyle: {
        color: colorFn(name),
      },
    };
  });

  const formatter = (params: { name: string; value: number; percent: number }) =>
    formatPieLabel({ params, numberFormatter, pieLabelType });

  const echartOptions = {
    tooltip: {
      confine: true,
      trigger: 'item',
      formatter: (params: { name: string; value: number; percent: number }) => {
        return formatPieLabel({ params, numberFormatter, pieLabelType: 'key_value_percent' });
      },
    },
    legend: showLegend
      ? {
          orient: 'horizontal',
          left: 10,
          data: keys,
        }
      : undefined,
    series: [
      {
        type: 'pie',
        radius: [`${donut ? innerRadius : 0}%`, `${outerRadius}%`],
        avoidLabelOverlap: true,
        labelLine: labelsOutside ? { show: true } : { show: false },
        label: labelsOutside
          ? {
              formatter,
              position: 'outer',
              show: showLabels,
              alignTo: 'none',
              bleedMargin: 5,
            }
          : {
              formatter,
              position: 'inner',
              show: showLabels,
            },
        emphasis: {
          label: {
            show: true,
            fontSize: '30',
            fontWeight: 'bold',
          },
        },
        data: transformedData,
      },
    ],
  };

  return {
    width,
    height,
    // @ts-ignore
    echartOptions,
  };
}
