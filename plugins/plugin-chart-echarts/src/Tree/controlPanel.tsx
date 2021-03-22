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
import {
  legendMarginControl,
  legendOrientationControl,
  legendTypeControl,
  showLegendControl,
} from '../controls';

const noopControl = { name: 'noop', config: { type: '', renderTrigger: true } };

const requiredEntity = {
  ...sharedControls.entity,
  clearable: false,
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
            name: 'relation',
            config: {
              ...requiredEntity,
              label: t('Relation'),
              description: t('Name of the relation column'),
            },
          },
        ],
        [
          {
            name: 'name',
            config: {
              ...requiredEntity,
              label: t('Name'),
              description: t('Name of the data column'),
            },
          },
        ],
        [
          {
            name: 'root_node',
            config: {
              ...requiredEntity,
              type: 'TextControl',
              label: t('Root node name'),
              description: t('Name of root node of tree'),
            },
          },
        ],
        ['metric'],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme'],
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
                  label: 'LR',
                  value: 'LR',
                },
                {
                  label: 'RL',
                  value: 'RL',
                },
                {
                  label: 'TB',
                  value: 'TB',
                },
                {
                  label: 'BT',
                  value: 'BT',
                },
              ],
              description: t('Orientation of tree'),
              visibility({ form_data: { layout } }) {
                return layout === 'orthogonal' || (!layout && DEFAULT_FORM_DATA.layout === 'orthogonal');
              },
            },
          },
        ],
        [
          {
            name: 'symbol',
            config: {
              type: 'RadioButtonControl',
              renderTrigger: true,
              label: t('Symbol'),
              default: DEFAULT_FORM_DATA.layout,
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
