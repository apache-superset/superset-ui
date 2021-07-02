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
import { QueryObject, SqlaFormData } from '@superset-ui/core';
import { timeCompareTransform } from '../../src';

const formData: SqlaFormData = {
  metrics: ['count(*)'],
  time_range: '2015 : 2016',
  granularity: 'month',
  datasource: 'foo',
  viz_type: 'table',
};
const queryObject: QueryObject = {
  metrics: ['count(*)'],
  time_range: '2015 : 2016',
  granularity: 'month',
  post_processing: [
    {
      operation: 'pivot',
      options: {
        index: ['__timestamp'],
        columns: ['nation'],
        aggregates: {
          'count(*)': {
            operator: 'sum',
          },
        },
      },
    },
    {
      operation: 'aggregation',
      options: {
        groupby: ['col1'],
        aggregates: 'count',
      },
    },
  ],
};

describe('timeCompareTransform', () => {
  it('skip transformation', () => {
    expect(timeCompareTransform(formData, queryObject).post_processing).toEqual(
      queryObject.post_processing,
    );
    expect(
      timeCompareTransform({ ...formData, time_compare: [] }, queryObject).post_processing,
    ).toEqual(queryObject.post_processing);
    expect(
      timeCompareTransform({ ...formData, comparison_type: null }, queryObject).post_processing,
    ).toEqual(queryObject.post_processing);
  });

  it('time compare: values', () => {
    const expected = timeCompareTransform(
      { ...formData, comparison_type: 'values', time_compare: ['1 year ago', '1 year later'] },
      queryObject,
    ).post_processing;
    expect(expected[0].options).not.toEqual(queryObject.post_processing[0].options);
    expect(expected[0].options.aggregates).toEqual({
      'count(*)': { operator: 'sum' },
      'count(*)__1 year ago': { operator: 'sum' },
      'count(*)__1 year later': { operator: 'sum' },
    });
  });

  it('time compare: absolute/percentage/ratio', () => {
    const comparisionTypes = ['absolute', 'percentage', 'ratio'];
    comparisionTypes.forEach(cType => {
      const expected = timeCompareTransform(
        { ...formData, comparison_type: cType, time_compare: ['1 year ago', '1 year later'] },
        queryObject,
      ).post_processing;
      expect(expected[0].operation).not.toBe(queryObject.post_processing[0].operation);

      // the pivot operator
      expect(expected[1].options.aggregates).toEqual({
        [`${cType}__count(*)__count(*)__1 year ago`]: { operator: 'sum' },
        [`${cType}__count(*)__count(*)__1 year later`]: { operator: 'sum' },
      });

      // the compare operator
      expect(expected[0]).toEqual({
        operation: 'compare',
        options: {
          source_columns: ['count(*)', 'count(*)'],
          compare_columns: ['count(*)__1 year ago', 'count(*)__1 year later'],
          compare_type: cType,
          drop_original_columns: true,
        },
      });
    });
  });
});
