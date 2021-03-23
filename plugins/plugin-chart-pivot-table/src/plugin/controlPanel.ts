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
import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  formatSelectOptions,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';

const config: ControlPanelConfig = {
  controlPanelSections: [
    { ...sections.legacyTimeseriesTime, expanded: false },
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'groupbyRows',
            config: {
              ...sharedControls.groupby,
              label: t('Rows'),
              description: t('Columns to group by on the rows'),
            },
          },
        ],
        [
          {
            name: 'groupbyColumns',
            config: {
              ...sharedControls.groupby,
              label: t('Columns'),
              description: t('Columns to group by on the columns'),
            },
          },
        ],
        [
          {
            name: 'metrics',
            config: {
              ...sharedControls.metrics,
              validators: [validateNonEmpty],
            },
          },
        ],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
            },
          },
        ],
        [
          {
            name: 'aggregateFunction',
            config: {
              type: 'SelectControl',
              label: t('Aggregation function'),
              clearable: false,
              choices: formatSelectOptions([
                'Count',
                'Count Unique Values',
                'List Unique Values',
                'Sum',
                'Integer Sum',
                'Average',
                'Median',
                'Sample Variance',
                'Sample Standard Deviation',
                'Minimum',
                'Maximum',
                'First',
                'Last',
                'Sum as Fraction of Total',
                'Sum as Fraction of Rows',
                'Sum as Fraction of Columns',
                'Count as Fraction of Total',
                'Count as Fraction of Rows',
                'Count as Fraction of Columns',
              ]),
              default: 'Sum',
              description: t(
                'Aggregate function to apply when pivoting and ' +
                  'computing the total rows and columns',
              ),
              renderTrigger: true,
            },
          },
        ],
      ],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'tableRenderer',
            config: {
              type: 'SelectControl',
              label: t('Pivot table type'),
              default: 'Table With Subtotal',
              choices: [
                // [value, label]
                ['Table With Subtotal', 'Table With Subtotal'],
                ['Table With Subtotal Heatmap', 'Table Heatmap'],
                ['Table With Subtotal Col Heatmap', 'Table Col Heatmap'],
                ['Table With Subtotal Row Heatmap', 'Table Row Heatmap'],
              ],
              renderTrigger: true,
              description: t('The type of pivot table visualization'),
            },
          },
        ],
        [
          {
            name: 'rowOrder',
            config: {
              type: 'SelectControl',
              label: t('Rows sort by'),
              default: 'key_a_to_z',
              choices: [
                // [value, label]
                ['key_a_to_z', 'key alphabetically'],
                ['value_a_to_z', 'value ascending'],
                ['value_z_to_a', 'value descending'],
              ],
              renderTrigger: true,
              description: t('Order of rows'),
            },
          },
          {
            name: 'colOrder',
            config: {
              type: 'SelectControl',
              label: t('Cols sort by'),
              default: 'key_a_to_z',
              choices: [
                // [value, label]
                ['key_a_to_z', 'key alphabetically'],
                ['value_a_to_z', 'value ascending'],
                ['value_z_to_a', 'value descending'],
              ],
              renderTrigger: true,
              description: t('Order of columns'),
            },
          },
        ],
        [
          {
            name: 'rowSubtotalPosition',
            config: {
              type: 'SelectControl',
              label: t('Rows subtotals position'),
              default: false,
              choices: [
                // [value, label]
                [true, 'Top'],
                [false, 'Bottom'],
              ],
              renderTrigger: true,
              description: t('Position of row level subtotals'),
            },
          },
          {
            name: 'colSubtotalPosition',
            config: {
              type: 'SelectControl',
              label: t('Cols subtotals position'),
              default: false,
              choices: [
                // [value, label]
                [true, 'Left'],
                [false, 'Right'],
              ],
              renderTrigger: true,
              description: t('Position of column level subtotals'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
