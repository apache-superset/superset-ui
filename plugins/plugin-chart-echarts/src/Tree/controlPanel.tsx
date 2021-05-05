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
import { ControlPanelConfig, sections, sharedControls } from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const requiredEntity = {
  ...sharedControls.entity,
  clearable: false,
};
const optionalEntity = {
  ...sharedControls.entity,
  clearable: true,
  validators: [],
};

const controlPanel: ControlPanelConfig = {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'id',
            config: {
              ...requiredEntity,
              label: t('Id'),
              description: t('Name of the id column'),
            },
          },
        ],
        [
          {
            name: 'parent',
            config: {
              ...requiredEntity,
              label: t('Parent'),
              description: t('Name of the column containing the id of the parent node'),
            },
          },
        ],
        [
          {
            name: 'name',
            config: {
              ...optionalEntity,
              label: t('Name'),
              description: t('Optional name of the data column.'),
            },
          },
        ],
        [
          {
            // Didn't set renderTrigger true because echart gives intermittent error like
            // "node is not defined" or bugs out with weird connections
            name: 'root_node_id',
            config: {
              ...optionalEntity,
              type: 'TextControl',
              label: t('Root node id'),
              description: t('Id of root node of the tree.'),
            },
          },
        ],
        [
          {
            name: 'metric',
            config: {
              ...optionalEntity,
              type: 'MetricsControl',
              label: t('Metric'),
              description: t('Metric for node values'),
            },
          },
        ],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart options'),
      expanded: true,
      controlSetRows: [
        [<h1 className="section-header">{t('Layout')}</h1>],
        [
          {
            name: 'layout',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Tree layout'),
              default: DEFAULT_FORM_DATA.layout,
              options: [
                {
                  label: 'orthogonal',
                  value: 'orthogonal',
                },
                {
                  label: 'radial',
                  value: 'radial',
                },
              ],
              description: t('Layout type of tree'),
            },
          },
        ],

        [
          {
            name: 'orient',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Tree orientation'),
              default: DEFAULT_FORM_DATA.orient,
              options: [
                {
                  label: 'Left to Right',
                  value: 'LR',
                },
                {
                  label: 'Right to Left',
                  value: 'RL',
                },
                {
                  label: 'Top to Bottom',
                  value: 'TB',
                },
                {
                  label: 'Bottom to Top',
                  value: 'BT',
                },
              ],
              description: t('Orientation of tree'),
              visibility({ form_data: { layout } }) {
                return (layout || DEFAULT_FORM_DATA.layout) === 'orthogonal';
              },
            },
          },
        ],
        [
          {
            name: 'node_label_position',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Node label position'),
              default: DEFAULT_FORM_DATA.nodeLabelPosition,
              options: [
                {
                  label: 'left',
                  value: 'left',
                },
                {
                  label: 'top',
                  value: 'top',
                },
                {
                  label: 'right',
                  value: 'right',
                },
                {
                  label: 'bottom',
                  value: 'bottom',
                },
              ],
              description: t('Position of intermidiate node label on tree'),
            },
          },
        ],
        [
          {
            name: 'child_label_position',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Child label position'),
              default: DEFAULT_FORM_DATA.childLabelPosition,
              options: [
                {
                  label: 'left',
                  value: 'left',
                },
                {
                  label: 'top',
                  value: 'top',
                },
                {
                  label: 'right',
                  value: 'right',
                },
                {
                  label: 'bottom',
                  value: 'bottom',
                },
              ],
              description: t('Position of child node label on tree'),
            },
          },
        ],
        [
          {
            name: 'emphasis',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Emphasis'),
              default: DEFAULT_FORM_DATA.emphasis,
              options: [
                {
                  label: 'ancestor',
                  value: 'ancestor',
                },
                {
                  label: 'descendant',
                  value: 'descendant',
                },
              ],
              description: t('Which relatives to highlight on hover'),
              visibility({ form_data: { layout } }) {
                return (layout || DEFAULT_FORM_DATA.layout) === 'orthogonal';
              },
            },
          },
        ],
        [
          {
            name: 'symbol',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Symbol'),
              default: DEFAULT_FORM_DATA.symbol,
              options: [
                {
                  label: 'empty circle',
                  value: 'emptyCircle',
                },
                {
                  label: 'circle',
                  value: 'circle',
                },
                {
                  label: 'rect',
                  value: 'rect',
                },
                {
                  label: 'triangle',
                  value: 'triangle',
                },
                {
                  label: 'diamond',
                  value: 'diamond',
                },
                {
                  label: 'pin',
                  value: 'pin',
                },
                {
                  label: 'arrow',
                  value: 'arrow',
                },
                {
                  label: 'none',
                  value: 'none',
                },
              ],
              description: t('Layout type of tree'),
            },
          },
        ],
        [
          {
            name: 'symbolSize',
            config: {
              type: 'SliderControl',
              label: t('Symbol size'),
              renderTrigger: true,
              min: 5,
              max: 30,
              step: 2,
              default: DEFAULT_FORM_DATA.symbolSize,
              description: t('Size of edge symbols'),
            },
          },
        ],
        [
          {
            name: 'roam',
            config: {
              type: 'SelectControl',
              label: t('Enable graph roaming'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.roam,
              choices: [
                [false, t('Disabled')],
                ['scale', t('Scale only')],
                ['move', t('Move only')],
                [true, t('Scale and Move')],
              ],
              description: t('Whether to enable changing graph position and scaling.'),
            },
          },
        ],
      ],
    },
  ],
};

export default controlPanel;