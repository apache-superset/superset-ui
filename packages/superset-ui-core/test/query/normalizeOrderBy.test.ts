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
import { normalizeOrderBy } from '@superset-ui/core/src/query';

describe('normalizeOrderBy', () => {
  it('should parse orderby', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [['count(*)', true]],
      }),
    ).toEqual([['count(*)', true]]);
  });

  it('should parse timeseries_limit_metric and order_desc', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        metrics: ['count(*)'],
        timeseries_limit_metric: {
          expressionType: 'SIMPLE',
          column: {
            id: 1,
            column_name: 'sales',
          },
          aggregate: 'SUM',
        },
        order_desc: true,
      }),
    ).toEqual([
      [
        {
          expressionType: 'SIMPLE',
          column: {
            id: 1,
            column_name: 'sales',
          },
          aggregate: 'SUM',
        },
        false,
      ],
    ]);
  });

  it('should parse first metric and sort_by_metric', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        metrics: ['count(*)'],
        sort_by_metric: true,
      }),
    ).toEqual([['count(*)', false]]);
  });

  it('should parse first metric and sort_by_metric is undefined', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        metrics: ['count(*)'],
        sort_by_metric: undefined,
      }),
    ).toEqual([['count(*)', true]]);
  });

  it('should return default orderby', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
      }),
    ).toEqual(undefined);
  });

  it('should remove empty orderby', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [],
      }),
    ).toEqual(undefined);
  });

  it('should remove orderby with an empty array', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [[]],
      }),
    ).toEqual(undefined);
  });

  it('should remove orderby with an empty metric', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [['', true]],
      }),
    ).toEqual(undefined);
  });

  it('should remove orderby with an empty adhoc metric', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [[{}, true]],
      }),
    ).toEqual(undefined);
  });

  it('should remove orderby with an non-boolean type', () => {
    expect(
      normalizeOrderBy({
        datasource: '5__table',
        viz_type: 'table',
        time_range: '1 year ago : 2013',
        orderby: [['count(*)', 'true']],
      }),
    ).toEqual(undefined);
  });
});
