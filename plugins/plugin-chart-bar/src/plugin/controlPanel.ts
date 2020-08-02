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
import {
  ControlPanelConfig,
  formatSelectOptions,
  D3_FORMAT_OPTIONS,
} from '@superset-ui/chart-controls';

export const stackedBars = {
  name: 'stacked_bars',
  config: {
    type: 'CheckboxControl',
    label: t('Stacked Bars'),
    renderTrigger: true,
    default: false,
    description: null,
  },
};

export const xAxisLabel = {
  name: 'x_axis_label',
  config: {
    type: 'TextControl',
    label: t('X Axis label'),
    renderTrigger: true,
    default: '',
    description: t('Show X Axis Label in the chart'),
  },
};

export const yAxisLabel = {
  name: 'y_axis_label',
  config: {
    type: 'TextControl',
    label: t('Y Axis label'),
    renderTrigger: true,
    default: '',
    description: t('Show Y Axis Label in the chart'),
  },
};

export const xAxisTickLabelAngle = {
  name: 'x_axis_tick_label_angle',
  config: {
    freeForm: true,
    label: t('X axis tick label angle'),
    renderTrigger: true,
    clearable: false,
    type: 'SelectControl',
    choices: formatSelectOptions(['0', '45', '90']),
    default: '45',
    description: t('Set X axis tick label angle in the chart'),
  },
};

export const yAxisTickLabelAngle = {
  name: 'y_axis_tick_label_angle',
  config: {
    freeForm: true,
    type: 'SelectControl',
    clearable: false,
    label: t('Y axis tick label angle'),
    renderTrigger: true,
    choices: formatSelectOptions(['0', '45', '90']),
    default: '0',
    description: t('Set Y axis tick label angle in the chart'),
  },
};

export const numbersFormat = {
  name: 'numbers_format',
  config: {
    label: t('Numbers Format'),
    description: t('Choose the format for numbers in the chart'),
    type: 'SelectControl',
    clearable: false,
    default: D3_FORMAT_OPTIONS[0],
    choices: D3_FORMAT_OPTIONS,
    renderTrigger: true,
  },
};

export const layout = {
  name: 'layout',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: t('Layout'),
    choices: formatSelectOptions(['horizontal', 'vertical']),
    default: 'horizontal',
    renderTrigger: true,
    description: t('Layout of the chart'),
  },
};

export const labelsColor = {
  name: 'labelsColor',
  config: {
    type: 'SelectControl',
    freeForm: true,
    clearable: false,
    label: t('Labels color'),
    choices: formatSelectOptions(['black', 'white']),
    default: 'white',
    renderTrigger: true,
    description: t('Color of the labels inside of bars'),
  },
};

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], ['metrics'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', layout],
        [numbersFormat, labelsColor, stackedBars],
      ],
    },
    {
      label: t('X Axis'),
      expanded: true,
      controlSetRows: [[xAxisLabel, xAxisTickLabelAngle]],
    },
    {
      label: t('Y Axis'),
      expanded: true,
      controlSetRows: [[yAxisLabel, yAxisTickLabelAngle]],
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
