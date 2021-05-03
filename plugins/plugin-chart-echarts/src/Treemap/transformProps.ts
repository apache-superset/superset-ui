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
  getTimeFormatter,
  NumberFormatter,
} from '@superset-ui/core';
import { groupBy, transform } from 'lodash';
import { CallbackDataParams } from 'echarts/types/src/util/types';
import { TreemapSeriesNodeItemOption } from 'echarts/types/src/chart/treemap/TreemapSeries';
import { EChartsOption, TreemapSeriesOption } from 'echarts';
import {
  DEFAULT_FORM_DATA as DEFAULT_TREEMAP_FORM_DATA,
  EchartsTreemapChartProps,
  EchartsTreemapFormData,
  EchartsTreemapLabelType,
} from './types';
import { EchartsProps } from '../types';
import { formatSeriesName } from '../utils/series';
import { defaultTooltip } from '../defaults';

export function formatLabel({
  params,
  labelType,
  numberFormatter,
}: {
  params: CallbackDataParams;
  labelType: EchartsTreemapLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name = '', value } = params;
  const formattedValue = numberFormatter(value as number);

  switch (labelType) {
    case EchartsTreemapLabelType.Key:
      return name;
    case EchartsTreemapLabelType.Value:
      return formattedValue;
    case EchartsTreemapLabelType.KeyValue:
      return `${name}: ${formattedValue}`;
    default:
      return name;
  }
}

export default function transformProps(chartProps: EchartsTreemapChartProps): EchartsProps {
  const { formData, height, queriesData, width } = chartProps;
  const { data = [] } = queriesData[0];

  const {
    colorScheme,
    groupby = [],
    metric = '',
    labelType,
    numberFormat,
    dateFormat,
    showLabels,
    showUpperLabels,
    treemapRatio,
    showBreadcrumb,
    roam,
    nodeClick,
  }: EchartsTreemapFormData = {
    ...DEFAULT_TREEMAP_FORM_DATA,
    ...formData,
  };

  const colorFn = CategoricalColorNamespace.getScale(colorScheme as string);
  const numberFormatter = getNumberFormatter(numberFormat);
  const formatter = (params: CallbackDataParams) =>
    formatLabel({
      params,
      numberFormatter,
      labelType,
    });

  const formatItemStyle = (name: string) => ({
    borderColor: colorFn(name),
    color: colorFn(name),
    borderWidth: 2,
    gapWidth: 2,
    borderColorSaturation: 0.6,
  });

  const transformer = (data: DataRecord[], _groupby: string[], metric: string) => {
    const [currGroupby, ...restGroupby] = _groupby;
    const currGrouping = groupBy(data, currGroupby);
    if (!restGroupby.length) {
      return transform(
        currGrouping,
        (result, value, key) => {
          (value ?? []).forEach(datum => {
            const name = formatSeriesName(key, {
              numberFormatter,
              timeFormatter: getTimeFormatter(dateFormat),
            });
            if (typeof datum[metric] !== 'number') {
              throw new Error(`${metric} is not number type`);
            }
            result.push({
              name,
              value: (datum[metric] as number) ?? 0,
              itemStyle: formatItemStyle(name),
            });
          });
        },
        [] as TreemapSeriesNodeItemOption[],
      );
    }
    return transform(
      currGrouping,
      (result, value, key) => {
        const name = formatSeriesName(key, {
          numberFormatter,
          timeFormatter: getTimeFormatter(dateFormat),
        });
        result.push({
          name,
          children: transformer(value, restGroupby, metric),
          itemStyle: formatItemStyle(name),
        });
      },
      [] as TreemapSeriesNodeItemOption[],
    );
  };

  const metricsLabel = getMetricLabel(metric);

  const transformedData: TreemapSeriesNodeItemOption[] = transformer(data, groupby, metricsLabel);

  const series: TreemapSeriesOption[] = [
    {
      type: 'treemap',
      animation: false,
      nodeClick,
      roam,
      breadcrumb: {
        show: showBreadcrumb,
        emptyItemWidth: 25,
      },
      squareRatio: treemapRatio,
      emphasis: {
        label: {
          show: true,
        },
      },
      levels: [
        {
          upperLabel: {
            show: false,
          },
        },
      ],
      label: {
        show: showLabels,
        formatter,
      },
      upperLabel: {
        show: showUpperLabels,
        formatter,
      },
      data: transformedData,
    },
  ];

  const echartOptions: EChartsOption = {
    tooltip: {
      ...defaultTooltip,
      trigger: 'item',
      formatter: (params: any) =>
        formatLabel({
          params,
          numberFormatter,
          labelType: EchartsTreemapLabelType.KeyValue,
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
