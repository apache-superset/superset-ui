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
import { GenericDataType, t } from '@superset-ui/core';
import {
  D3_FORMAT_DOCS,
  D3_FORMAT_OPTIONS,
  D3_TIME_FORMAT_DOCS,
  D3_TIME_FORMAT_OPTIONS,
} from '../../../utils';
import { ControlFormItemSpec } from '../../../components/ControlForm';
import { ColumnConfigFormLayout } from './types';

export type SharedColumnConfigProp =
  | 'alignPositiveNegative'
  | 'colorPositiveNegative'
  | 'columnWidth'
  | 'decimal'
  | 'd3NumberFormat'
  | 'd3TimeFormat'
  | 'horizontalAlign'
  | 'showCellBars';

const REGEXP_CSS_DIMENSION = /^([0-9.]+(px|%)?|auto)$/i;

const validateCssDimension = (value: string) => {
  if (!REGEXP_CSS_DIMENSION.test(value)) {
    return t('Must be a number or percentage');
  }
  return false;
};

/**
 * All configurable column formatting properties.
 */
export const SHARED_COLUMN_CONFIG_PROPS: Record<SharedColumnConfigProp, ControlFormItemSpec> = {
  d3NumberFormat: {
    controlType: 'Select',
    label: t('D3 format'),
    description: D3_FORMAT_DOCS,
    options: D3_FORMAT_OPTIONS,
    defaultValue: D3_FORMAT_OPTIONS[0][0],
    creatable: true,
  },

  d3TimeFormat: {
    controlType: 'Select',
    label: t('D3 format'),
    description: D3_TIME_FORMAT_DOCS,
    options: D3_TIME_FORMAT_OPTIONS,
    defaultValue: D3_TIME_FORMAT_OPTIONS[0][0],
    creatable: true,
  },

  decimal: {
    controlType: 'Slider',
    label: t('Decimals'),
    description: t('Number of decimals to round small numbers to'),
  },

  columnWidth: {
    controlType: 'Input',
    label: t('Column width'),
    width: 130,
    description: t('Column width in pixels or percentages'),
    placeholder: 'auto',
    validators: [validateCssDimension],
  },

  horizontalAlign: {
    controlType: 'RadioButtonControl',
    label: t('Alignment'),
    description: t('Horizontal alignment'),
    width: 130,
    defaultValue: 'left',
    options: [
      ['left', t('Left')],
      ['right', t('Right')],
    ],
  },
  showCellBars: {
    controlType: 'Checkbox',
    label: t('Show cell bars'),
    description: t('Whether to display a bar chart background in table columns'),
    defaultValue: true,
  },

  alignPositiveNegative: {
    controlType: 'Checkbox',
    label: t('Align +/-'),
    description: t(
      'Whether to align background charts with both positive and negative values at 0',
    ),
    defaultValue: false,
  },

  colorPositiveNegative: {
    controlType: 'Checkbox',
    label: t('Color +/-'),
    description: t('Whether to colorize numeric values by if they are positive or negative'),
    defaultValue: false,
  },
};

export const DEFAULT_CONFIG_FORM_LAYOUT: ColumnConfigFormLayout = {
  [GenericDataType.STRING]: [
    ['columnWidth', { name: 'horizontalAlign', override: { defaultValue: 'left' } }],
  ],
  [GenericDataType.NUMERIC]: [
    ['columnWidth', { name: 'horizontalAlign', override: { defaultValue: 'right' } }],
    ['d3NumberFormat'],
    ['alignPositiveNegative', 'colorPositiveNegative'],
    ['showCellBars'],
  ],
  [GenericDataType.TEMPORAL]: [],
  [GenericDataType.BOOLEAN]: [],
};
