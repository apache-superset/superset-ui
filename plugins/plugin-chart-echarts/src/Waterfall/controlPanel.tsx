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
import { FeatureFlag, isFeatureEnabled, t, validateNonEmpty } from '@superset-ui/core';
import {
  ColumnOption,
  formatSelectOptions,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from '../Pie/types';

const { emitFilter, showLegend } = DEFAULT_FORM_DATA;

const xAxisColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('XAxis column'),
  description: t('Choose table column that will be displayed on XAxis in chart'),
  multi: false,
  optionRenderer: c => <ColumnOption showType column={c} />,
  valueRenderer: c => <ColumnOption column={c} />,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

const periodColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('Period column'),
  description: t('Choose table column that will split data to periods'),
  multi: false,
  optionRenderer: c => <ColumnOption showType column={c} />,
  valueRenderer: c => <ColumnOption column={c} />,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

export default {
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['metric'],
        ['adhoc_filters'],
        [
          {
            name: 'x_axis_column',
            config: xAxisColumn,
          },
        ],
        [
          {
            name: 'period_column',
            config: periodColumn,
          },
        ],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        isFeatureEnabled(FeatureFlag.DASHBOARD_CROSS_FILTERS)
          ? [
              {
                name: 'emit_filter',
                config: {
                  type: 'CheckboxControl',
                  label: t('Enable emitting filters'),
                  default: emitFilter,
                  renderTrigger: true,
                  description: t('Enable emmiting filters.'),
                },
              },
            ]
          : [],
        [
          {
            name: 'show_legend',
            config: {
              type: 'CheckboxControl',
              label: t('Show legend'),
              renderTrigger: true,
              default: showLegend,
              description: t('Whether to display a legend for the chart'),
            },
          },
        ],
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Y Axis')}</h1>],
        [
          {
            name: 'y_axis_label',
            config: {
              type: 'TextControl',
              label: t('Y Axis Label'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        ['y_axis_format'],
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('X Axis')}</h1>],
        [
          {
            name: 'x_axis_label',
            config: {
              type: 'TextControl',
              label: t('X Axis Label'),
              renderTrigger: true,
              default: '',
            },
          },
        ],
        [
          {
            name: 'x_ticks_layout',
            config: {
              type: 'SelectControl',
              label: t('X Tick Layout'),
              choices: formatSelectOptions(['auto', 'flat', '45°', '90°', 'staggered']),
              default: 'auto',
              clearable: false,
              renderTrigger: true,
              description: t('The way the ticks are laid out on the X-axis'),
            },
          },
        ],
      ],
    },
  ],
};
