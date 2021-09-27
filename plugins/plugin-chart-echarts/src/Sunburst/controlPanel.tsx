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
import { t } from '@superset-ui/core';
import { ControlPanelConfig, sections, emitFilterControl } from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

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
        emitFilterControl,
        ['row_limit'],
        [
          {
            name: 'sort_by_metric',
            config: {
              type: 'CheckboxControl',
              label: t('Sort by metric'),
              description: t('Whether to sort results by the selected metric in descending order.'),
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
        [
          {
            name: 'innerRadius',
            config: {
              type: 'SliderControl',
              label: t('Inner Radius'),
              renderTrigger: true,
              min: 0,
              max: 500,
              default: DEFAULT_FORM_DATA.innerRadius,
              description: t('Inner radius of Sunburst chart'),
            },
          },
        ],
        [
          {
            name: 'outerRadius',
            config: {
              type: 'SliderControl',
              label: t('Outer Radius'),
              renderTrigger: true,
              min: 0,
              max: 500,
              default: DEFAULT_FORM_DATA.outerRadius,
              description: t('Outer radius of Sunburst chart'),
            },
          },
        ],
        [
          {
            name: 'rotateLabel',
            config: {
              type: 'RadioButtonControl',
              label: t('Rotate Label'),
              renderTrigger: true,
              options: [
                ['radial', t('Radial')],
                ['tangential', t('Tangential')],
              ],
              default: DEFAULT_FORM_DATA.rotateLabel,
              description: t('Rotate label on the chart'),
            },
          },
        ],

        [
          {
            name: 'labelMinAngle',
            config: {
              type: 'TextControl',
              label: t('Label Mininum Angle'),
              renderTrigger: true,
              isInt: true,
              default: DEFAULT_FORM_DATA.labelMinAngle,
              description: t('Minimum angle for label to be displayed on graph.'),
            },
          },
        ],
        [
          {
            name: 'showLabel',
            config: {
              type: 'CheckboxControl',
              label: t('Show labels on chart'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.showLabel,
              description: t('Whether to show labels on the chart.'),
            },
          },
        ],
        [
          {
            name: 'labelPosition',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Label Position'),
              description: t('Label position on the chart'),
              default: DEFAULT_FORM_DATA.labelPosition,
              choices: [
                ['inside', t('Inside')],
                ['outside', t('Outside')],
              ],
            },
          },
        ],
        // TODO: doesn't work, might be echart bug
        // [
        //   {
        //     name: 'labelDistance',
        //     config: {
        //       type: 'TextControl',
        //       label: t('Label Distance'),
        //       renderTrigger: true,
        //       isInt: true,
        //       default: DEFAULT_FORM_DATA.labelDistance,
        //       description: t('Distance from the chart.'),
        //     },
        //   },
        // ],
        [
          {
            name: 'labelType',
            config: {
              type: 'SelectControl',
              label: t('Label Type'),
              default: DEFAULT_FORM_DATA.labelType,
              renderTrigger: true,
              choices: [
                ['key', 'Category Name'],
                ['value', 'Value'],
                ['key_value', 'Category and Value'],
              ],
              description: t('What should be shown on the label?'),
            },
          },
        ],
      ],
    },
  ],
};

export default config;
