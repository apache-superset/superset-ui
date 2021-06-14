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
import { QueryFormData } from '@superset-ui/core';

function ensureIsInt<T>(value: T, defaultValue: number): number {
  return Number.isNaN(parseInt(String(value), 10)) ? defaultValue : parseInt(String(value), 10);
}

export const rollingWindowTransform = ({
  rolling_type,
  rolling_periods,
  min_periods,
  metrics,
}: QueryFormData) => {
  const columns = Object.fromEntries(
    metrics?.map(metric => {
      if (typeof metric === 'string') {
        return [metric, metric];
      }
      return [metric.label, metric.label];
    }) || [],
  );

  if (!rolling_type || rolling_type === 'None') {
    return null;
  }
  if (rolling_type === 'cumsum') {
    return {
      operation: 'cum',
      options: {
        operator: 'sum',
        columns,
      },
    };
  }

  return {
    operation: 'rolling',
    options: {
      rolling_type,
      window: ensureIsInt(rolling_periods, 1),
      min_periods: ensureIsInt(min_periods, 0),
      columns,
    },
  };
};

export const timeCompareTransform = (formData: QueryFormData) => null;

export const resampleTransform = (formData: QueryFormData) => null;

export default {};
