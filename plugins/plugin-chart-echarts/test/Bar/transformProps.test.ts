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
import transformProps from '../../src/Bar/transformProps';

describe('EchartsBarMiexedTimeseries tranformProps', () => {
  const formData = {
    timeseries: true,
    colorScheme: 'bnbColors',
    datasource: '2__table',
    granularity_sqla: 'year',
    metrics: ['sum__SP_POP_TOTL', 'sum__SP_POP_TOTL'],
    groupby: ['country_code', 'country_name'],
  };
  const queriesData = [
    {
      data: [
        {
          __timestamp: -315619200000,
          'sum__SP_POP_TOTL, BGD, Bangladesh': 48200702,
          'sum__SP_RUR_TOTL, BGD, Bangladesh': 45725596,
        },
        {
          __timestamp: -283996800000,
          'sum__SP_POP_TOTL, BGD, Bangladesh': 49593610,
          'sum__SP_RUR_TOTL, BGD, Bangladesh': 46976059,
        },
      ],
    },
  ];
  const chartPropsConfig = {
    formData,
    width: 800,
    height: 600,
    queriesData,
  };

  it('should tranform chart props for viz', () => {
    const chartProps = new ChartProps(chartPropsConfig);
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          legend: expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                name: 'sum__SP_POP_TOTL, BGD, Bangladesh',
              }),
              expect.objectContaining({
                name: 'sum__SP_RUR_TOTL, BGD, Bangladesh',
              }),
            ]),
          }),
          series: expect.arrayContaining([
            expect.objectContaining({
              data: expect.arrayContaining([
                expect.objectContaining({ value: [new Date(-315619200000), 48200702] }),
                expect.objectContaining({ value: [new Date(-283996800000), 49593610] }),
              ]),
              name: 'sum__SP_POP_TOTL, BGD, Bangladesh',
            }),
            expect.objectContaining({
              data: expect.arrayContaining([
                expect.objectContaining({ value: [new Date(-315619200000), 45725596] }),
                expect.objectContaining({ value: [new Date(-283996800000), 46976059] }),
              ]),
              name: 'sum__SP_RUR_TOTL, BGD, Bangladesh',
            }),
          ]),
        }),
      }),
    );
  });
});
