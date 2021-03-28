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
import { t, validateNonEmpty } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  D3_TIME_FORMAT_OPTIONS,
  sections,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';
import { legendOrientationControl, legendTypeControl, showLegendControl } from '../controls';
import { LABEL_POSITION } from '../constants';

const { labelType, labelPosition, numberFormat, showLabels, isCircle } = DEFAULT_FORM_DATA;

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], ['metrics'], ['adhoc_filters'], ['row_limit']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Legend')}</h1>],
        [showLegendControl],
        [legendTypeControl],
        [legendOrientationControl],
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Labels')}</h1>],
        [
          {
            name: 'show_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Labels'),
              renderTrigger: true,
              default: showLabels,
              description: t('Whether to display the labels.'),
            },
          },
        ],
        [
          {
            name: 'label_type',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: labelType,
              renderTrigger: true,
              choices: [
                ['value', 'Value'],
                ['key_value', 'Category and Value'],
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
        [
          {
            name: 'label_position',
            config: {
              type: 'SelectControl',
              freeForm: false,
              label: t('Label position'),
              renderTrigger: true,
              choices: LABEL_POSITION,
              default: labelPosition,
              description: D3_FORMAT_DOCS,
            },
          },
        ],
        [
          {
            name: 'number_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Number format'),
              renderTrigger: true,
              default: numberFormat,
              choices: D3_FORMAT_OPTIONS,
              description: `${t('D3 format syntax: https://github.com/d3/d3-format')} ${t(
                'Only applies when "Label Type" is set to show values.',
              )}`,
            },
          },
        ],
        [
          {
            name: 'date_format',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Date format'),
              renderTrigger: true,
              choices: D3_TIME_FORMAT_OPTIONS,
              default: 'smart_date',
              description: D3_FORMAT_DOCS,
            },
          },
        ],
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Radar')}</h1>],
        [
          {
            name: 'is_circle',
            config: {
              type: 'CheckboxControl',
              label: t('Circle radar shape'),
              renderTrigger: true,
              default: isCircle,
              description: t('Whether to display the labels.'),
            },
          },
        ],
      ],
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
