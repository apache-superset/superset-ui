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
import {
  buildQueryContext,
  ensureIsArray,
  getMetricLabel,
  PostProcessingRule,
  QueryFormData,
  QueryMode,
  QueryObject,
  removeDuplicates,
} from '@superset-ui/core';
import { BuildQuery } from '@superset-ui/core/lib/chart/registries/ChartBuildQueryRegistrySingleton';
import { HandlebarsQueryFormData } from '../types';

/**
 * The buildQuery function is used to create an instance of QueryContext that's
 * sent to the chart data endpoint. In addition to containing information of which
 * datasource to use, it specifies the type (e.g. full payload, samples, query) and
 * format (e.g. CSV or JSON) of the result and whether or not to force refresh the data from
 * the datasource as opposed to using a cached copy of the data, if available.
 *
 * More importantly though, QueryContext contains a property `queries`, which is an array of
 * QueryObjects specifying individual data requests to be made. A QueryObject specifies which
 * columns, metrics and filters, among others, to use during the query. Usually it will be enough
 * to specify just one query based on the baseQueryObject, but for some more advanced use cases
 * it is possible to define post processing operations in the QueryObject, or multiple queries
 * if a viz needs multiple different result sets.
 */

/**
 * Infer query mode from form data. If `all_columns` is set, then raw records mode,
 * otherwise defaults to aggregation mode.
 *
 * The same logic is used in `controlPanel` with control values as well.
 */
export function getQueryMode(formData: QueryFormData) {
  const { query_mode: mode } = formData;
  if (mode === QueryMode.aggregate || mode === QueryMode.raw) {
    return mode;
  }
  const rawColumns = formData?.all_columns;
  const hasRawColumns = rawColumns && rawColumns.length > 0;
  return hasRawColumns ? QueryMode.raw : QueryMode.aggregate;
}

const buildQuery: BuildQuery<HandlebarsQueryFormData> = (
  formData: HandlebarsQueryFormData,
  options,
) => {
  const { percent_metrics: percentMetrics, order_desc: orderDesc = false } = formData;
  const queryMode = getQueryMode(formData);
  const sortByMetric = ensureIsArray(formData.timeseries_limit_metric)[0];
  let formDataCopy = formData;
  // never include time in raw records mode
  if (queryMode === QueryMode.raw) {
    formDataCopy = {
      ...formData,
      include_time: false,
    };
  }

  return buildQueryContext(formDataCopy, baseQueryObject => {
    let { metrics, orderby = [] } = baseQueryObject;
    let postProcessing: PostProcessingRule[] = [];

    if (queryMode === QueryMode.aggregate) {
      metrics = metrics || [];
      // orverride orderby with timeseries metric when in aggregation mode
      if (sortByMetric) {
        orderby = [[sortByMetric, !orderDesc]];
      } else if (metrics?.length > 0) {
        // default to ordering by first metric in descending order
        // when no "sort by" metric is set (regargless if "SORT DESC" is set to true)
        orderby = [[metrics[0], false]];
      }
      // add postprocessing for percent metrics only when in aggregation mode
      if (percentMetrics && percentMetrics.length > 0) {
        const percentMetricLabels = removeDuplicates(percentMetrics.map(getMetricLabel));
        metrics = removeDuplicates(metrics.concat(percentMetrics), getMetricLabel);
        postProcessing = [
          {
            operation: 'contribution',
            options: {
              columns: percentMetricLabels,
              rename_columns: percentMetricLabels.map(x => `%${x}`),
            },
          },
        ];
      }
    }

    const moreProps: Partial<QueryObject> = {};
    const ownState = options?.ownState ?? {};
    if (formDataCopy.server_pagination) {
      moreProps.row_limit = ownState.pageSize ?? formDataCopy.server_page_length;
      moreProps.row_offset = (ownState.currentPage ?? 0) * (ownState.pageSize ?? 0);
    }

    let queryObject = {
      ...baseQueryObject,
      orderby,
      metrics,
      post_processing: postProcessing,
      ...moreProps,
    };

    if (
      formData.server_pagination &&
      options?.extras?.cachedChanges?.[formData.slice_id] &&
      JSON.stringify(options?.extras?.cachedChanges?.[formData.slice_id]) !==
        JSON.stringify(queryObject.filters)
    ) {
      queryObject = { ...queryObject, row_offset: 0 };
      updateExternalFormData(options?.hooks?.setDataMask, 0, queryObject.row_limit ?? 0);
    }
    // Because we use same buildQuery for all table on the page we need split them by id
    options?.hooks?.setCachedChanges({ [formData.slice_id]: queryObject.filters });

    const extraQueries: QueryObject[] = [];
    if (metrics?.length && formData.show_totals && queryMode === QueryMode.aggregate) {
      extraQueries.push({
        ...queryObject,
        columns: [],
        row_limit: 0,
        row_offset: 0,
        post_processing: [],
      });
    }

    const interactiveGroupBy = formData.extra_form_data?.interactive_groupby;
    if (interactiveGroupBy && queryObject.columns) {
      queryObject.columns = [...new Set([...queryObject.columns, ...interactiveGroupBy])];
    }

    if (formData.server_pagination) {
      return [
        { ...queryObject },
        { ...queryObject, row_limit: 0, row_offset: 0, post_processing: [], is_rowcount: true },
        ...extraQueries,
      ];
    }

    return [queryObject, ...extraQueries];
  });
};

// Use this closure to cache changing of external filters, if we have server pagination we need reset page to 0, after
// external filter changed
export const cachedBuildQuery = (): BuildQuery<HandlebarsQueryFormData> => {
  let cachedChanges: any = {};
  const setCachedChanges = (newChanges: any) => {
    cachedChanges = { ...cachedChanges, ...newChanges };
  };

  return (formData, options) =>
    buildQuery(
      { ...formData },
      {
        extras: { cachedChanges },
        ownState: options?.ownState ?? {},
        hooks: {
          ...options?.hooks,
          setDataMask: () => {},
          setCachedChanges,
        },
      },
    );
};

export default cachedBuildQuery();
function updateExternalFormData(
  setDataMask: import('@superset-ui/core').SetDataMaskHook | undefined,
  arg1: number,
  arg2: number,
) {
  throw new Error('Function not implemented.');
}
