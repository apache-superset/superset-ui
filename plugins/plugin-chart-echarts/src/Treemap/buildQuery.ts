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
import { buildQueryContext, ensureIsArray, QueryFormData } from '@superset-ui/core';

export default function buildQuery(formData: QueryFormData) {
  const {
    timeseries_limit_metric: timeseriesLimitMetric,
    order_desc: orderDesc = false,
  } = formData;
  const sortByMetric = ensureIsArray(timeseriesLimitMetric)[0];

  return buildQueryContext(formData, baseQueryObject => {
    let { metrics, orderby = [] } = baseQueryObject;
    metrics = metrics || [];
    if (sortByMetric) {
      orderby = [[sortByMetric, !orderDesc]];
    } else if (metrics?.length > 0) {
      orderby = [[metrics[0], false]];
    }

    return [
      {
        ...baseQueryObject,
        orderby,
      },
    ];
  });
}
