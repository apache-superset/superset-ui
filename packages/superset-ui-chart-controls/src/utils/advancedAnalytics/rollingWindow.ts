/* eslint-disable camelcase */
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
 * specific language governing permissions and limitationsxw
 * under the License.
 */
import {
  ensureIsInt,
  ensureIsArray,
  QueryFormData,
  RollingType,
  PostProcessingRolling,
  PostProcessingCum,
  QueryFormMetric,
  ComparisionType,
} from '@superset-ui/core';
import { getMetricOffsetsMap, isValidTimeCompare, TIME_COMPARISION } from './utils';

export function rollingWindowTransform(
  formData: QueryFormData,
  queryMetrics: QueryFormMetric[],
): PostProcessingRolling | PostProcessingCum | undefined {
  let columns;
  if (isValidTimeCompare(formData, queryMetrics)) {
    const metricsMap = getMetricOffsetsMap(formData, queryMetrics);
    const comparisonType = formData.comparison_type;
    if (formData.comparison_type === ComparisionType.Values) {
      columns = Object.fromEntries(
        [...Array.from(metricsMap.values()), ...Array.from(metricsMap.keys())].map(m => [m, m]),
      );
    } else {
      columns = Object.fromEntries(
        Array.from(metricsMap.entries()).map(([offset, metric]) => [
          [comparisonType, metric, offset].join(TIME_COMPARISION),
          [comparisonType, metric, offset].join(TIME_COMPARISION),
        ]),
      );
    }
  } else {
    columns = Object.fromEntries(
      ensureIsArray(formData.metrics).map(metric => {
        if (typeof metric === 'string') {
          return [metric, metric];
        }
        return [metric.label, metric.label];
      }),
    );
  }

  if (formData.rolling_type === RollingType.Cumsum) {
    return {
      operation: 'cum',
      options: {
        operator: 'sum',
        columns,
      },
    };
  }

  if ([RollingType.Sum, RollingType.Mean, RollingType.Std].includes(formData.rolling_type)) {
    return {
      operation: 'rolling',
      options: {
        rolling_type: formData.rolling_type,
        window: ensureIsInt(formData.rolling_periods, 1),
        min_periods: ensureIsInt(formData.min_periods, 0),
        columns,
      },
    };
  }

  return undefined;
}

export default {};
