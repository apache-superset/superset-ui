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
import { ensureIsArray, QueryFormData, QueryObject } from '@superset-ui/core';

function ensureIsInt<T>(value: T, defaultValue: number): number {
  return Number.isNaN(parseInt(String(value), 10)) ? defaultValue : parseInt(String(value), 10);
}

export function rollingWindowTransform(
  formData: QueryFormData,
  queryObject: QueryObject,
): QueryObject {
  if (formData.rolling_type === 'None' || !formData.rolling_type) {
    return queryObject;
  }

  const post_processing = ensureIsArray(queryObject.post_processing);
  const columns = Object.fromEntries(
    formData.metrics?.map(metric => {
      if (typeof metric === 'string') {
        return [metric, metric];
      }
      return [metric.label, metric.label];
    }) || [],
  );
  if (formData.rolling_type === 'cumsum') {
    // rolling must be the first operation(before pivot or other transforms)
    post_processing.unshift({
      operation: 'cum',
      options: {
        operator: 'sum',
        columns,
      },
    });
  }

  if (['sum', 'mean', 'std'].includes(formData.rolling_type)) {
    // same before
    post_processing.unshift({
      operation: 'rolling',
      options: {
        rolling_type: formData.rolling_type,
        window: ensureIsInt(formData.rolling_periods, 1),
        min_periods: ensureIsInt(formData.min_periods, 0),
        columns,
      },
    });
  }
  return { ...queryObject, post_processing };
}

export default {};
