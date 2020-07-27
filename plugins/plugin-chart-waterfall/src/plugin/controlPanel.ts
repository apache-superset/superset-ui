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
import { ControlPanelConfig, sharedControls } from '@superset-ui/chart-controls';

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

// TODO: Uncomment when dashboard will support ChartsFilter
// const filterConfigs = {
//   type: 'CollectionControl',
//   label: 'Filters',
//   description: t('Choose columns name that will be filtered on bar click'),
//   validators: [],
//   controlName: 'FilterBoxItemControl',
//   mapStateToProps: ({ datasource }) => ({ datasource }),
// };

const config: ControlPanelConfig = {
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
    // TODO: Uncomment when dashboard will support ChartsFilter
    // {
    //   label: t('Filters On Click'),
    //   expanded: true,
    //   controlSetRows: [
    //     [
    //       {
    //         name: 'filter_configs',
    //         config: filterConfigs,
    //       },
    //     ],
    //   ],
    // },
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
