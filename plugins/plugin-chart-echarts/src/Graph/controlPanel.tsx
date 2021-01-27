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
import { formatSelectOptions, sections } from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const { layout, roam, draggable, selectedMode, showSymbolThreshold } = DEFAULT_FORM_DATA;

export default {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['groupby'], ['metric'], ['adhoc_filters'], ['row_limit']],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'layout',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Graph Layout'),
              default: layout,
              choices: formatSelectOptions(['force', 'circular']), //cant show none,as data does not have x,y indices
              description: t('Layout type of graph'),
            },
          },
        ],
        [
          {
            name: 'draggable',
            config: {
              type: 'CheckboxControl',
              label: t('Enable node draging'),
              renderTrigger: true,
              default: draggable,
              description: t('Whether to enable node dragging in force layout mode.'),
            },
          },
          {
            name: 'roam',
            config: {
              type: 'CheckboxControl',
              label: t('Enable graph roaming'),
              renderTrigger: true,
              default: roam,
              description: t('Whether to enable chaging graph position.'),
            },
          },
        ],
        [
          {
            name: 'selectMode',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Node Select Mode'),
              default: selectedMode,
              choices: formatSelectOptions(['single', 'multiple']),
              description: t('Allow node selections'),
            },
          },
        ],
        [
          {
            name: 'showSymbolThreshold',
            config: {
              type: 'TextControl',
              label: t('Label Threshold'),
              renderTrigger: true,
              isInt: true,
              default: showSymbolThreshold,
              description: t('Minimum value for label to be displayed on graph.'),
            },
          },
        ],
      ],
    },
  ],
  controlOverrides: {
    groupby: {
      label: t('Source / Target'),
      description: t('Choose a source and a target'),
    },
  },
};
