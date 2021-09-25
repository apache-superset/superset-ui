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
import { ChartProps, SqlaFormData } from '@superset-ui/core';
import transformProps, { formatLabel } from '../../src/Sunburst/transformProps';
import { EchartsSunburstLabelType } from '../../src/Sunburst/types';

describe('Build hierarchay', () => {
  it('Should build hierarchy with 1 level', () => {
    const formData: SqlaFormData = {
      colorScheme: 'bnbColors',
      datasource: '3__table',
      granularity_sqla: 'ds',
      metric: 'value',
      groupby: ['col_1'],
      viz_type: 'sunburst',
    };
    const chartProps = new ChartProps({
      formData,
      width: 800,
      height: 600,
      queriesData: [
        {
          data: [
            {
              col_1: 'item_1',
              value: 10,
            },
            {
              col_1: 'item_2',
              value: 20,
            },
          ],
        },
      ],
    });
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          series: expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                children: [],
                name: 'item_1',
                value: 10,
              }),
              expect.objectContaining({
                name: 'item_2',
                children: [],
                value: 20,
              }),
            ]),
          }),
        }),
      }),
    );
  });

  it('Should build hierarchy with 2 levels', () => {
    const formData: SqlaFormData = {
      colorScheme: 'bnbColors',
      datasource: '3__table',
      granularity_sqla: 'ds',
      metric: 'value',
      groupby: ['col_1', 'col_2'],
      viz_type: 'sunburst',
    };
    const chartProps = new ChartProps({
      formData,
      width: 800,
      height: 600,
      queriesData: [
        {
          data: [
            {
              col_1: 'item_1',
              col_2: 'item_2',
              value: 10,
            },
            {
              col_1: 'item_3',
              col_2: 'item_4',
              value: 20,
            },
          ],
        },
      ],
    });
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          series: expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                name: 'item_1',
                children: expect.arrayContaining([
                  expect.objectContaining({ name: 'item_2', value: 10, children: [] }),
                ]),
                level: 0,
              }),
              expect.objectContaining({
                name: 'item_3',
                children: expect.arrayContaining([
                  expect.objectContaining({ name: 'item_4', value: 20, children: [] }),
                ]),
                level: 0,
              }),
            ]),
          }),
        }),
      }),
    );
  });
  it('Should build hierarchy with 2 levels and shared children', () => {
    const formData: SqlaFormData = {
      colorScheme: 'bnbColors',
      datasource: '3__table',
      granularity_sqla: 'ds',
      metric: 'value',
      groupby: ['col_1', 'col_2'],
      viz_type: 'sunburst',
    };
    const chartProps = new ChartProps({
      formData,
      width: 800,
      height: 600,
      queriesData: [
        {
          data: [
            {
              col_1: 'item_1',
              col_2: 'item_2',
              value: 10,
            },
            {
              col_1: 'item_1',
              col_2: 'item_3',
              value: 20,
            },
          ],
        },
      ],
    });
    expect(transformProps(chartProps)).toEqual(
      expect.objectContaining({
        width: 800,
        height: 600,
        echartOptions: expect.objectContaining({
          series: expect.objectContaining({
            data: expect.arrayContaining([
              expect.objectContaining({
                name: 'item_1',
                children: expect.arrayContaining([
                  expect.objectContaining({ name: 'item_2', value: 10, children: [] }),
                  expect.objectContaining({ name: 'item_3', value: 20, children: [] }),
                ]),
                level: 0,
              }),
            ]),
          }),
        }),
      }),
    );
  });
});

describe('formatPieLabel', () => {
  it('should generate a valid sunburst chart label', () => {
    expect(
      formatLabel({
        params: { name: 'My Label', value: 1234 },
        labelType: EchartsSunburstLabelType.Key,
        sanitizeName: true,
      }),
    ).toEqual('My Label');
    expect(
      formatLabel({
        params: { name: 'My Label', value: 1234 },
        labelType: EchartsSunburstLabelType.Value,
        sanitizeName: false,
      }),
    ).toEqual('1234');
    expect(
      formatLabel({
        params: { name: 'My Label', value: 1234 },
        labelType: EchartsSunburstLabelType.KeyValue,
        sanitizeName: false,
      }),
    ).toEqual('My Label - 1234');
  });
});
