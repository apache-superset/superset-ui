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
import { getNumberFormatter, NumberFormats, NumberFormatter } from '@superset-ui/core';
import { EchartsPieLabelType } from '../Pie/types';

const percentFormatter = getNumberFormatter(NumberFormats.PERCENT_2_POINT);

// eslint-disable-next-line import/prefer-default-export
export function formatPieLabel({
  params,
  pieLabelType,
  numberFormatter,
}: {
  params: { name: string; value: number; percent: number };
  pieLabelType: EchartsPieLabelType;
  numberFormatter: NumberFormatter;
}): string {
  const { name, value, percent } = params;
  const formattedValue = numberFormatter(value);
  const formattedPercent = percentFormatter(percent / 100);
  if (pieLabelType === 'key') return name;
  if (pieLabelType === 'value') return formattedValue;
  if (pieLabelType === 'percent') return formattedPercent;
  if (pieLabelType === 'key_value') return `${name}: ${formattedValue}`;
  if (pieLabelType === 'key_value_percent')
    return `${name}: ${formattedValue} (${formattedPercent})`;
  if (pieLabelType === 'key_percent') return `${name}: ${formattedPercent}`;
  return name;
}
