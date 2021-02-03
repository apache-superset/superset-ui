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
import {
  formatSelectOptions,
  sections,
  sharedControls,
  ControlConfig,
  ControlPanelConfig,
  ColumnOption,
} from '@superset-ui/chart-controls';
import { DEFAULT_FORM_DATA } from './types';

const noopControl = { name: 'noop', config: { type: '', renderTrigger: true } };

const sourceControl = {
  name: 'source',
  config: {
    ...sharedControls.entity,
    type: 'SelectControl',
    multi: false,
    freeForm: true,
    label: t('Source'),
    default: [],
    includeTime: false,
    description: t('Source for nodes of graph'),
    optionRenderer: c => <ColumnOption column={c} showType />,
    valueRenderer: c => <ColumnOption column={c} />,
    valueKey: 'column_name',
    allowAll: true,
    filterOption: ({ data: opt }, text) =>
      (opt.column_name && opt.column_name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
      (opt.verbose_name && opt.verbose_name.toLowerCase().indexOf(text.toLowerCase()) >= 0),
    promptTextCreator: label => label,
    mapStateToProps: (state, control) => {
      const newState = {};
      if (state.datasource) {
        newState.options = state.datasource.columns.filter(c => c.groupby);
      }
      return newState;
    },
    commaChoosesOption: false,
  },
};

const targetControl = {
  name: 'target',
  config: {
    ...sharedControls.entity,
    type: 'SelectControl',
    multi: false,
    freeForm: true,
    label: t('Target'),
    default: [],
    includeTime: false,
    description: t('Target for nodes of graph'),
    optionRenderer: c => <ColumnOption column={c} showType />,
    valueRenderer: c => <ColumnOption column={c} />,
    valueKey: 'column_name',
    allowAll: true,
    filterOption: ({ data: opt }, text) =>
      (opt.column_name && opt.column_name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
      (opt.verbose_name && opt.verbose_name.toLowerCase().indexOf(text.toLowerCase()) >= 0),
    promptTextCreator: label => label,
    mapStateToProps: (state, control) => {
      //TODO: is this required?
      const newState = {};
      if (state.datasource) {
        newState.options = state.datasource.columns.filter(c => c.groupby);
      }
      return newState;
    },
    commaChoosesOption: false,
  },
};
//TODO: use only one object and other override params
const categoryControl = {
  name: 'category',
  config: {
    ...sharedControls.entity,
    type: 'SelectControl',
    multi: false,
    freeForm: true,
    clearable: true,
    label: t('Category'),
    default: null,
    includeTime: false,
    description: t('Optional category for nodes'),
    optionRenderer: c => <ColumnOption column={c} showType />,
    valueRenderer: c => <ColumnOption column={c} />,
    valueKey: 'column_name',

    filterOption: ({ data: opt }, text) =>
      (opt.column_name && opt.column_name.toLowerCase().indexOf(text.toLowerCase()) >= 0) ||
      (opt.verbose_name && opt.verbose_name.toLowerCase().indexOf(text.toLowerCase()) >= 0),
    promptTextCreator: label => label,
    mapStateToProps: (state, control) => {
      const newState = {};
      if (state.datasource) {
        newState.options = state.datasource.columns.filter(c => c.groupby);
      }
      return newState;
    },
    commaChoosesOption: false,
    validators: [],
  },
};

export default {
  controlPanelSections: [
    sections.legacyRegularTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [sourceControl],
        [targetControl],
        [categoryControl],
        ['metric'],
        ['adhoc_filters'],
        ['row_limit'],
      ],
    },
    {
      label: t('Chart Options'),
      expanded: true,
      controlSetRows: [
        ['color_scheme', noopControl],
        [
          {
            name: 'layout',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Graph Layout'),
              default: DEFAULT_FORM_DATA.layout,
              choices: formatSelectOptions([
                ['force', t('Force')],
                ['circular', t('Circular')],
              ]),
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
              default: DEFAULT_FORM_DATA.draggable,
              description: t('Whether to enable node dragging in force layout mode.'),
            },
          },
          {
            name: 'roam',
            config: {
              type: 'CheckboxControl',
              label: t('Enable graph roaming'),
              renderTrigger: true,
              default: DEFAULT_FORM_DATA.roam,
              description: t('Whether to enable chaging graph position.'),
            },
          },
        ],
        [
          {
            name: 'select_mode',
            config: {
              type: 'SelectControl',
              renderTrigger: true,
              label: t('Node Select Mode'),
              default: DEFAULT_FORM_DATA.selectedMode,
              choices: formatSelectOptions([
                ['single', t('Single')],
                ['multiple', t('Multiple')],
              ]),
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
              default: DEFAULT_FORM_DATA.showSymbolThreshold,
              description: t('Minimum value for label to be displayed on graph.'),
            },
          },
        ],
      ],
    },
  ],
};
