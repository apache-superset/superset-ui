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
import { t } from '@superset-ui/core';
import {
  ControlPanelConfig,
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  D3_TIME_FORMAT_OPTIONS,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const {
  labelType,
  numberFormat,
  showLabels,
  showUpperLabels,
  dateFormat,
  treemapRatio,
  showBreadcrumb,
  roam,
  nodeClick,
} = DEFAULT_FORM_DATA;

const config: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metric'],
        ['adhoc_filters'],
        [
          {
            name: 'row_limit',
            config: {
              ...sharedControls.row_limit,
              default: 10,
            },
          },
        ],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
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
            name: 'show_upper_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Show Upper Labels'),
              renderTrigger: true,
              default: showUpperLabels,
              description: t('Whether to display the upperLabels.'),
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
                ['Key', 'Key'],
                ['value', 'Value'],
                ['key_value', 'Category and Value'],
              ],
              description: t('What should be shown on the label?'),
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
              description: `${t('D3 format syntax: https://github.com/d3/d3-format. ')} ${t(
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
              default: dateFormat,
              description: D3_FORMAT_DOCS,
            },
          },
        ],
        [<h1 className="section-header">{t('Treemap')}</h1>],
        [
          {
            name: 'show_breadcrumb',
            config: {
              type: 'CheckboxControl',
              label: t('Show Breadcrumb'),
              renderTrigger: true,
              default: showBreadcrumb,
              description: t('Whether to display the breadcrumb.'),
            },
          },
        ],
        [
          {
            name: 'treemap_ratio',
            config: {
              type: 'TextControl',
              label: t('Ratio'),
              renderTrigger: true,
              isFloat: true,
              default: treemapRatio,
              description: t('Target aspect ratio for treemap tiles.'),
            },
          },
        ],
        [
          {
            name: 'roam',
            config: {
              type: 'SelectControl',
              label: t('Enable treemap roaming'),
              renderTrigger: true,
              default: roam,
              choices: [
                [false, t('Disabled')],
                ['scale', t('Scale only')],
                ['move', t('Move only')],
                [true, t('Scale and Move')],
              ],
              description: t('Whether to enable changing treemap position and scaling.'),
            },
          },
        ],
        [
          {
            name: 'node_click',
            config: {
              type: 'SelectControl',
              label: t('Node Click'),
              renderTrigger: true,
              default: nodeClick,
              choices: [
                [false, t('Do nothing after clicked')],
                ['zoomToNode', t('Zoom to clicked node')],
              ],
              description: t('The behaviour when clicking a node'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
