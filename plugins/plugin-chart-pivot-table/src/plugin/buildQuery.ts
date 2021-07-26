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
import { buildQueryContext, ensureIsArray, QueryFormOrderBy } from '@superset-ui/core';
import { PivotTableQueryFormData } from '../types';

export default function buildQuery(formData: PivotTableQueryFormData) {
  const { groupbyColumns = [], groupbyRows = [], orderDesc = true } = formData;
  const groupbySet = new Set([
    ...ensureIsArray<string>(groupbyColumns),
    ...ensureIsArray<string>(groupbyRows),
  ]);
  const sortByMetric = ensureIsArray(formData.timeseries_limit_metric)[0];
  return buildQueryContext(formData, baseQueryObject => {
    const metrics = ensureIsArray(baseQueryObject.metrics);
    let orderby: QueryFormOrderBy[] = [];
    if (sortByMetric) {
      orderby = [[sortByMetric, !orderDesc]];
    } else if (metrics[0]) {
      orderby = [[metrics[0], false]];
    }
    return [
      {
        ...baseQueryObject,
        columns: [...groupbySet],
        orderby,
      },
    ];
  });
}
