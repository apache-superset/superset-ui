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
import { ELayout } from '../components/utils';
import { TBarChartProps } from '../components/BarChart';

type TMetric = {
  label: string;
};

export type TLabelColors = 'black' | 'white';

type TFormData = {
  layout: ELayout;
  colorScheme: string;
  stackedBars: boolean;
  numbersFormat: string;
  labelsColor: TLabelColors;
  xAxisLabel: string;
  yAxisLabel: string;
  xAxisTickLabelAngle: string;
  yAxisTickLabelAngle: string;
  metrics: TMetric[];
  groupby: string[];
};

export type TResultData = TData & {
  rechartsDataKey: string;
  rechartsTotal?: number;
};

type TData = Record<string, string | number>;

export default function transformProps(chartProps: ChartProps) {
  const { width, height, queryData } = chartProps;
  const data = queryData.data as TData[];
  const formData = chartProps.formData as TFormData;
  const metrics = formData.metrics.map(metric => metric.label);

  let resultData: TResultData[] = data.map(item => ({
    ...item,
    rechartsDataKey: formData.groupby.map(field => item[field]).join(', '),
  }));

  if (formData.stackedBars) {
    resultData = resultData.map(item => ({
      ...item,
      rechartsTotal: metrics.reduce((total, metric) => total + (item[metric] as number), 0),
    }));
  }

  const result: TBarChartProps = {
    width,
    height,
    layout: formData.layout,
    colorScheme: formData.colorScheme,
    stackedBars: formData.stackedBars,
    numbersFormat: formData.numbersFormat,
    labelsColor: formData.labelsColor,
    xAxis: {
      label: formData.xAxisLabel,
      tickLabelAngle: -Number(formData.xAxisTickLabelAngle),
    },
    yAxis: {
      label: formData.yAxisLabel,
      tickLabelAngle: -Number(formData.yAxisTickLabelAngle),
    },
    data: resultData,
    metrics,
  };
  return result;
}
