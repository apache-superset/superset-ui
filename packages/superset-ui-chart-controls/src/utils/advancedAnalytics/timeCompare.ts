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

const TIME_COMPARISION = '__';

export function timeCompareTransform(
  formData: QueryFormData,
  queryObject: QueryObject,
): QueryObject {
  const timeCompare = ensureIsArray(formData.time_compare);
  const comparisonType = formData.comparison_type;
  if (timeCompare.length === 0 || !comparisonType) {
    return queryObject;
  }

  const post_processing = ensureIsArray(queryObject.post_processing);
  const metricLabels = (queryObject.metrics || []).map(getMetricLabel);
  const timeCompareMapping: [string, string][] = [];
  metricLabels.forEach(m => {
    timeCompare.forEach((t: string) => {
      timeCompareMapping.push([m, [m, t].join(TIME_COMPARISION)]);
    });
  });

  const pivotProcessingIdx = post_processing.findIndex(
    processing => processing?.operation === 'pivot',
  );
  if (pivotProcessingIdx > -1) {
    const valuesAgg = Object.fromEntries(
      metricLabels
        .concat(timeCompareMapping.map(([col1, col2]) => col2))
        .map(metric => [metric, { operator: 'sum' }]),
    );
    const changeAgg = Object.fromEntries(
      timeCompareMapping
        .map(([col1, col2]) => [comparisonType, col1, col2].join(TIME_COMPARISION))
        .map(metric => [metric, { operator: 'sum' }]),
    );

    post_processing[pivotProcessingIdx] = {
      operation: 'pivot',
      options: {
        index: ['__timestamp'],
        columns: formData.groupby || [],
        aggregates: comparisonType === 'values' ? valuesAgg : changeAgg,
      },
    };
  }
  if (comparisonType === 'values') {
    return { ...queryObject, post_processing, time_offsets: timeCompare };
  }

  const timeCompareProcessing = [
    {
      operation: 'compare',
      options: {
        source_columns: timeCompareMapping.map(_ => _[0]),
        compare_columns: timeCompareMapping.map(_ => _[1]),
        compare_type: comparisonType,
        drop_original_columns: true,
      },
    },
  ].concat(post_processing);

  return { ...queryObject, post_processing: timeCompareProcessing, time_offsets: timeCompare };
}

export default {};
