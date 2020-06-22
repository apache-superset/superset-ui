/* eslint-disable camelcase */
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
import React from 'react';
import { t } from '@superset-ui/translation';
import {
  formatSelectOptions,
  D3_TIME_FORMAT_OPTIONS,
  ControlConfig,
  ColumnOption,
  ControlStateMapping,
  ControlPanelConfig,
  ControlPanelsContainerProps,
} from '@superset-ui/chart-controls/src';
import { validateNonEmpty } from '@superset-ui/validator';

export enum QueryMode {
  agg = 'agg',
  raw = 'raw',
}

const QueryModeLabel = {
  [QueryMode.agg]: t('Aggregate'),
  [QueryMode.raw]: t('Raw Records'),
};

function getQueryMode(controls: ControlStateMapping): QueryMode {
  const mode = controls?.query_mode?.value;
  if (mode === QueryMode.agg || mode === QueryMode.raw) {
    return mode as QueryMode;
  }
  const groupby = controls?.groupby?.value;
  const hasGroupBy = groupby && (groupby as string[])?.length > 0;
  return hasGroupBy ? QueryMode.agg : QueryMode.raw;
}

/**
 * Visibility check
 */
function isQueryMode(mode: QueryMode) {
  return ({ controls }: ControlPanelsContainerProps) => {
    return getQueryMode(controls) === mode;
  };
}

const isAggMode = isQueryMode(QueryMode.agg);
const isRawMode = isQueryMode(QueryMode.raw);

const queryMode: ControlConfig<'RadioButtonControl'> = {
  type: 'RadioButtonControl',
  label: t('Query Mode'),
  default: QueryMode.agg,
  options: [
    {
      label: QueryModeLabel[QueryMode.agg],
      value: QueryMode.agg,
    },
    {
      label: QueryModeLabel[QueryMode.raw],
      value: QueryMode.raw,
    },
  ],
  mapStateToProps: ({ controls }) => {
    return { value: getQueryMode(controls as ControlStateMapping) };
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'query_mode',
            config: queryMode,
          },
        ],
        [
          {
            name: 'groupby',
            override: {
              visibility: isAggMode,
            },
          },
        ],
        [
          {
            name: 'metrics',
            override: {
              validators: [],
              visibility: isAggMode,
            },
          },
          {
            name: 'all_columns',
            config: {
              type: 'SelectControl',
              label: t('Columns'),
              description: t('Columns to display'),
              multi: true,
              freeForm: true,
              allowAll: true,
              commaChoosesOption: false,
              default: [],
              optionRenderer: (c: never) => <ColumnOption showType column={c} />,
              valueRenderer: (c: never) => <ColumnOption column={c} />,
              valueKey: 'column_name',
              mapStateToProps: ({ datasource, controls }) => ({
                options: datasource?.columns || [],
                queryMode: getQueryMode(controls),
              }),
              visibility: isRawMode,
            },
          },
        ],
        [
          {
            name: 'percent_metrics',
            config: {
              type: 'MetricsControl',
              label: t('Percentage Metrics'),
              description: t('Metrics for which percentage of total are to be displayed'),
              multi: true,
              visibility: isAggMode,
              mapStateToProps: ({ datasource, controls }) => {
                return {
                  columns: datasource?.columns || [],
                  savedMetrics: datasource?.metrics || [],
                  datasourceType: datasource?.type,
                  queryMode: getQueryMode(controls),
                };
              },
              default: [],
              validators: [],
            },
          },
        ],
        [
          {
            name: 'timeseries_limit_metric',
            override: {
              visibility: isAggMode,
            },
          },
          {
            name: 'order_by_cols',
            config: {
              type: 'SelectControl',
              label: t('Ordering'),
              description: t('One or many metrics to display'),
              multi: true,
              default: [],
              mapStateToProps: ({ datasource }) => ({
                choices: datasource?.order_by_choices || [],
              }),
              visibility: isRawMode,
            },
          },
        ],
        ['row_limit'],
        [
          {
            name: 'include_time',
            config: {
              type: 'CheckboxControl',
              label: t('Include Time'),
              description: t(
                'Whether to include the time granularity as defined in the time section',
              ),
              default: false,
              visibility: isAggMode,
            },
          },
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
              visibility: isAggMode,
            },
          },
        ],
        ['adhoc_filters'],
      ],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'table_timestamp_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Table Timestamp Format'),
              default: '%Y-%m-%d %H:%M:%S',
              renderTrigger: true,
              validators: [validateNonEmpty],
              clearable: false,
              choices: D3_TIME_FORMAT_OPTIONS,
              description: t('Timestamp Format'),
            },
          },
        ],
        [
          {
            name: 'page_length',
            config: {
              type: 'SelectControl',
              freeForm: true,
              renderTrigger: true,
              label: t('Page Length'),
              default: 0,
              choices: formatSelectOptions([0, 10, 25, 40, 50, 75, 100, 150, 200]),
              description: t('Rows per page, 0 means no pagination'),
            },
          },
          null,
        ],
        [
          {
            name: 'include_search',
            config: {
              type: 'CheckboxControl',
              label: t('Search Box'),
              renderTrigger: true,
              default: false,
              description: t('Whether to include a client-side search box'),
            },
          },
          {
            name: 'table_filter',
            config: {
              type: 'CheckboxControl',
              label: t('Emit Filter Events'),
              renderTrigger: true,
              default: false,
              description: t('Whether to apply filter when items are clicked'),
            },
          },
        ],
        [
          {
            name: 'align_pn',
            config: {
              type: 'CheckboxControl',
              label: t('Align +/-'),
              renderTrigger: true,
              default: false,
              description: t('Whether to align the background chart for +/- values'),
            },
          },
          {
            name: 'color_pn',
            config: {
              type: 'CheckboxControl',
              label: t('Color +/-'),
              renderTrigger: true,
              default: true,
              description: t('Whether to color +/- values'),
            },
          },
        ],
        [
          {
            name: 'show_cell_bars',
            config: {
              type: 'CheckboxControl',
              label: t('Show Cell Bars'),
              renderTrigger: true,
              default: true,
              description: t('Enable to display bar chart background elements in table columns'),
            },
          },
          null,
        ],
      ],
    },
  ],
  sectionOverrides: {
    druidTimeSeries: {
      controlSetRows: [['granularity', 'druid_time_origin'], ['time_range']],
    },
    sqlaTimeSeries: {
      controlSetRows: [['granularity_sqla', 'time_grain_sqla'], ['time_range']],
    },
  },
};

export default config;
