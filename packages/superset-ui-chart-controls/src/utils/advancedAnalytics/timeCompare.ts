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
import { getMetricLabel, ensureIsArray, QueryFormData, QueryObject } from '@superset-ui/core';
import { PostProcessingPivot } from '@superset-ui/core/lib/query/types/PostProcessing';

const TIME_COMPARISION = '__';

export function timeCompareTransform(
  formData: QueryFormData,
  queryObject: QueryObject,
): QueryObject {
  const timeOffsets = ensureIsArray(formData.time_compare);
  const comparisonType = formData.comparison_type;
  if (timeOffsets.length === 0 || !comparisonType) {
    return queryObject;
  }

  let post_processing = ensureIsArray(queryObject.post_processing);
  const metricLabels = (queryObject.metrics || []).map(getMetricLabel);
  // metric offset label and metric label mapping, for instance:
  // {
  //   "SUM(value)__1 year ago": "SUM(value)",
  //   "SUM(value)__2 year ago": "SUM(value)"
  // }
  const metricOffsetMap = new Map<string, string>();

  metricLabels.forEach((metric: string) => {
    timeOffsets.forEach((offset: string) => {
      metricOffsetMap.set([metric, offset].join(TIME_COMPARISION), metric);
    });
  });

  post_processing = post_processing.map(processing => {
    if (processing?.operation === 'pivot') {
      const valuesAgg = Object.fromEntries(
        metricLabels
          .concat(Array.from(metricOffsetMap.keys()))
          .map(metric => [metric, { operator: 'sum' }]),
      );
      const changeAgg = Object.fromEntries(
        Array.from(metricOffsetMap.entries())
          .map(([offset, metric]) => [comparisonType, metric, offset].join(TIME_COMPARISION))
          .map(metric => [metric, { operator: 'sum' }]),
      );

      return {
        operation: 'pivot',
        options: {
          index: ['__timestamp'],
          columns: formData.groupby || [],
          aggregates: comparisonType === 'values' ? valuesAgg : changeAgg,
        },
      } as PostProcessingPivot;
    }
    return processing;
  });

  if (comparisonType === 'values') {
    return { ...queryObject, post_processing, time_offsets: timeOffsets };
  }

  post_processing.unshift({
    operation: 'compare',
    options: {
      source_columns: Array.from(metricOffsetMap.values()),
      compare_columns: Array.from(metricOffsetMap.keys()),
      compare_type: comparisonType,
      drop_original_columns: true,
    },
  });

  return { ...queryObject, post_processing, time_offsets: timeOffsets };
}

export default {};
