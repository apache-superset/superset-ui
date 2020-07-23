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
import { t } from '@superset-ui/translation';
import { validateNonEmpty } from '@superset-ui/validator';
import { ControlPanelConfig } from '@superset-ui/chart-controls';
import React from 'react';
import ColumnOption, { sharedControls } from '@superset-ui/chart-controls';

const xAxisColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('XAxis column'),
  description: t(
    'Choose table column that will be displayed on XAxis in chart, should be chosen also in "Group by"',
  ),
  multi: false,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource, controls }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

const periodColumn: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('Period column'),
  description: t(
    'Choose table column that will split data to periods, should be chosen also in "Group by"',
  ),
  multi: false,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource, controls }) => ({
    options: datasource?.columns || [],
  }),
  validators: [validateNonEmpty],
};

const filterConfigs = {
  type: 'CollectionControl',
  label: 'Filters',
  description: t('Choose columns name that will be filtered on bar click'),
  validators: [],
  controlName: 'FilterBoxItemControl',
  mapStateToProps: ({ datasource }) => ({ datasource }),
};

const config: ControlPanelConfig = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three groupby columns. This is due
   * to the `series` control having the property `queryField` set to
   * `groupby`, which automatically appends the values from the
   * `series` control to the `groupby` control when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/validator';
   * import { sharedControls, ControlConfig, ControlPanelConfig } from '@superset-ui/chart-controls'; 
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/validator` package:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */

  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    {
      label: t('Map Fields'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'x_axis_column',
            config: xAxisColumn,
          },
          {
            name: 'period_column',
            config: periodColumn,
          },
        ],
      ],
    },
    {
      label: t('Filters On Click'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'filter_configs',
            config: filterConfigs,
          },
        ],
      ],
    },
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['metrics'], ['adhoc_filters'], ['row_limit', null]],
    },
  ],

  controlOverrides: {
    series: {
      validators: [validateNonEmpty],
      clearable: false,
    },
    row_limit: {
      default: 100,
    },
  },
};

export default config;
