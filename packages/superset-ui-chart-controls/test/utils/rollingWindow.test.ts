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
import { rollingWindowTransform } from '../../src';

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
  ],
};

describe('rollingWindowTransform', () => {
  it('skip transformation', () => {
    expect(rollingWindowTransform(formData, queryObject).post_processing).toEqual(
      queryObject.post_processing,
    );
    expect(
      rollingWindowTransform({ ...formData, rolling_type: 'None' }, queryObject).post_processing,
    ).toEqual(queryObject.post_processing);
  });

  it('rolling_type: cumsum', () => {
    const expected = rollingWindowTransform({ ...formData, rolling_type: 'cumsum' }, queryObject)
      .post_processing;
    expect(expected).not.toEqual(queryObject.post_processing);
    expect(expected[1]).toEqual(queryObject.post_processing[0]);
    expect(expected[0]).toEqual({
      operation: 'cum',
      options: {
        operator: 'sum',
        columns: { 'count(*)': 'count(*)' },
      },
    });
  });

  it('rolling_type: sum/mean/std', () => {
    const rollingTypes = ['sum', 'mean', 'std'];
    rollingTypes.forEach(rollingType => {
      const expected = rollingWindowTransform(
        { ...formData, rolling_type: rollingType },
        queryObject,
      ).post_processing;
      expect(expected).not.toEqual(queryObject.post_processing);
      expect(expected[1]).toEqual(queryObject.post_processing[0]);
      expect(expected[0]).toEqual({
        operation: 'rolling',
        options: {
          rolling_type: rollingType,
          window: 1,
          min_periods: 0,
          columns: { 'count(*)': 'count(*)' },
        },
      });
    });
  });
});
