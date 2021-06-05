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
import { ChartProps } from '@superset-ui/core';
import transformProps from '../../src/Waterfall/transformProps';

describe('Waterfall tranformProps', () => {
  const formData = {
    colorScheme: 'bnbColors',
    datasource: '3__table',
    granularity_sqla: 'ds',
    metric: 'sum',
    category: 'foo',
    breakdown: 'bar',
  };
  const chartProps = new ChartProps({
    formData,
    width: 800,
    height: 600,
    queriesData: [
      {
        data: [
          { foo: 'Sylvester', bar: '2019', sum: 10 },
          { foo: 'Arnold', bar: '2019', sum: 3 },
          { foo: 'Sylvester', bar: '2020', sum: -10 },
          { foo: 'Arnold', bar: '2020', sum: 5 },
        ],
      },
    ],
  });

  it('should tranform chart props for viz', () => {
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          series: [
            expect.objectContaining({
              data: ['-', 3, 3, '-'],
            }),
            expect.objectContaining({
              data: ['-', '-', 5, '-'],
            }),
            expect.objectContaining({
              data: ['-', 10, '-', '-'],
            }),
            expect.objectContaining({
              data: [13, '-', '-', 8],
            }),
          ],
        }),
      }),
    );
  });
});
