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
import { ChartProps, getNumberFormatter, SqlaFormData } from '@superset-ui/core';
import transformProps, { buildHierarchy, formatLabel } from '../../src/Sunburst/transformProps';
import { EchartsPieLabelType } from '../../src/Pie/types';
import { EchartsSunburstLabelType } from '../../src/Sunburst/types';

describe('Build hierarchay', () => {
  it('Should build hierarchy with 1 level', () => {
    const data = [
      {
        col_1: 'item_1',
        value: 10,
      },
      {
        col_1: 'item_2',
        value: 20,
      },
    ];
    expect(buildHierarchy(data, ['col_1'], 'value')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'item_1',
          children: [],
          value: 10,
        }),
        expect.objectContaining({
          name: 'item_2',
          children: [],
          value: 20,
        }),
      ]),
    );
  });

  it('Should build hierarchy with 2 levels', () => {
    const data = [
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
    ];
    expect(buildHierarchy(data, ['col_1', 'col_2'], 'value')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'item_1',
          children: [{ name: 'item_2', value: 10, children: [] }],
          level: 0,
        }),
        expect.objectContaining({
          name: 'item_3',
          children: [{ name: 'item_4', value: 20, children: [] }],
          level: 0,
        }),
      ]),
    );
  });
  it('Should build hierarchy with 2 levels and shared children', () => {
    const data = [
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
    ];
    expect(buildHierarchy(data, ['col_1', 'col_2'], 'value')).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'item_1',
          children: [
            { name: 'item_2', value: 10, children: [] },
            { name: 'item_3', value: 20, children: [] },
          ],
          level: 0,
        }),
      ]),
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
