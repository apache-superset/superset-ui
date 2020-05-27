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

// type State = unknown;

export default {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [['series'], ['metric'], ['adhoc_filters'], ['row_limit', null]],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'observable_url',
            config: {
              type: 'TextControl',
              label: t('Observable URL'),
              description: t('URL of the Observable HQ workbook you wish to add in'),
              renderTrigger: true,
              clearable: true,
            },
          },
        ],
        [
          {
            name: 'displayed_cells',
            config: {
              type: 'SelectControl',
              multi: true,
              label: t('Displayed Cells'),
              default: [],
              description: t(
                'Select the cells from your Observable notebook that you wish to display on the Dashboard',
              ),
              // optionRenderer: c => <ColumnOption showType column={c} />,
              // valueRenderer: c => <ColumnOption column={c} />,
              // valueKey: 'column_name',
              allowAll: true,
              // mapStateToProps: (state: State) => {
              //   console.warn('state!!!!!!!!!!!', state);
              //   return {
              //     options: state.datasource ? state.datasource.columns : [],
              //   };
              // },
              options: ['some', 'observable', 'cells', 'here'],
              // commaChoosesOption: false,
              // freeForm: true,
              renderTrigger: true,
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
  },
};
