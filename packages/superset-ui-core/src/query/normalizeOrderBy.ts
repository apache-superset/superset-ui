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
import isEmpty from 'lodash/isEmpty';
import isBoolean from 'lodash/isBoolean';

import { FormDataResidual, QueryFormOrderBy } from './types';
import { t } from '../translation';

const defaultOrderby = undefined;

export default function normalizeOrderBy(
  formData: FormDataResidual,
): QueryFormOrderBy[] | typeof defaultOrderby {
  if (Array.isArray(formData.orderby) && formData.orderby.length > 0) {
    const orderbyClauses = formData.orderby.map(item => {
      // value can be in the format of `['["col1", true]', '["col2", false]']`,
      // where the option strings come directly from `order_by_choices`.
      if (typeof item === 'string') {
        try {
          return JSON.parse(item);
        } catch (error) {
          throw new Error(t('Found invalid orderby options'));
        }
      }
      return item;
    });
    // ensure a valid orderby clause
    const validatedOrderbys = orderbyClauses.filter(
      orderbyClause =>
        Array.isArray(orderbyClause) &&
        orderbyClause.length === 2 &&
        !isEmpty(orderbyClause[0]) &&
        isBoolean(orderbyClause[1]),
    );
    return isEmpty(validatedOrderbys) ? defaultOrderby : validatedOrderbys;
  }

  const isAsc = !formData.order_desc;
  if (
    formData.timeseries_limit_metric !== undefined &&
    formData.timeseries_limit_metric !== null &&
    !isEmpty(formData.timeseries_limit_metric)
  ) {
    return [[formData.timeseries_limit_metric, isAsc]];
  }

  if (Array.isArray(formData.metrics) && formData.metrics.length > 0) {
    return [[formData.metrics[0], isAsc]];
  }

  return defaultOrderby;
}
