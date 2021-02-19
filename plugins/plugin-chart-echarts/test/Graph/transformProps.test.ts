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
import transformProps from '../../src/Graph/transformProps';
import { DEFAULT_GRAPH_SERIES_OPTION } from '../../src/Graph/constants';

describe('EchartsGraph tranformProps', () => {
  it('should tranform chart props for viz without category', () => {
    const formData = {
      colorScheme: 'bnbColors',
      datasource: '3__table',
      granularity_sqla: 'ds',
      metric: 'count',
      source: 'source_column',
      target: 'target_column',
      category: null,
    };
    const queriesData = [
      {
        colnames: ['source_column', 'target_column', 'count'],
        data: [
          {
            source_column: 'source_value',
            target_column: 'target_value',
            count: 6,
          },
          {
            source_column: 'source_value',
            target_column: 'target_value',
            count: 5,
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

    const chartProps = new ChartProps(chartPropsConfig);
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          legend: expect.objectContaining({
            data: [],
          }),
          series: expect.arrayContaining([
            expect.objectContaining({
              data: [
                {
                  id: '0',
                  name: 'source_value',
                  value: 11,
                  symbolSize: 10,
                  category: undefined,
                  select: DEFAULT_GRAPH_SERIES_OPTION.select,
                  tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
                  label: { show: true },
                },
                {
                  id: '1',
                  name: 'target_value',
                  value: 11,
                  symbolSize: 10,
                  category: undefined,
                  select: DEFAULT_GRAPH_SERIES_OPTION.select,
                  tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
                  label: { show: true },
                },
              ],
            }),
          ]),
        }),
      }),
    );
  });

  it('should tranform chart props for viz with category and falsey normalization', () => {
    const formData = {
      colorScheme: 'bnbColors',
      datasource: '3__table',
      granularity_sqla: 'ds',
      metric: 'count',
      source: 'source_column',
      target: 'target_column',
      sourceCategory: 'source_category_column',
      targetCategory: 'target_category_column',
    };
    const queriesData = [
      {
        colnames: [
          'source_column',
          'target_column',
          'source_category_column',
          'target_category_column',
          'count',
        ],
        data: [
          {
            source_column: 'source_value',
            target_column: 'target_value',
            source_category_column: 'category_value_1',
            target_category_column: 'category_value_2',
            count: 6,
          },
          {
            source_column: 'source_value',
            target_column: 'target_value',
            source_category_column: 'category_value_1',
            target_category_column: 'category_value_2',
            count: 5,
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

    const chartProps = new ChartProps(chartPropsConfig);
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          legend: expect.objectContaining({
            data: ['category_value_1', 'category_value_2'],
          }),
          series: expect.arrayContaining([
            expect.objectContaining({
              data: [
                {
                  id: '0',
                  name: 'source_value',
                  value: 11,
                  symbolSize: 10,
                  category: 'category_value_1',
                  select: DEFAULT_GRAPH_SERIES_OPTION.select,
                  tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
                  label: { show: true },
                },
                {
                  id: '1',
                  name: 'target_value',
                  value: 11,
                  symbolSize: 10,
                  category: 'category_value_2',
                  select: DEFAULT_GRAPH_SERIES_OPTION.select,
                  tooltip: DEFAULT_GRAPH_SERIES_OPTION.tooltip,
                  label: { show: true },
                },
              ],
            }),
          ]),
        }),
      }),
    );
  });
});
