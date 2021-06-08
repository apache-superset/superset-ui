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
import { t /* validateNonEmpty, validateInteger */ } from '@superset-ui/core';
import {
  sharedControls,
  ControlPanelConfig,
  D3_TIME_FORMAT_DOCS,
  sections,
  ControlStateMapping,
  ControlPanelsContainerProps,
} from '@superset-ui/chart-controls';
import { legendSection } from '../controls';

const timeseriesVisibility = ({ controls }: ControlPanelsContainerProps) =>
  Boolean(controls?.timeseries?.value);

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Timeseries'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'timeseries',
            config: {
              type: 'CheckboxControl',
              label: t('Is a Timeseries Bar Chart'),
              default: false,
              renderTrigger: false,
              description: t('Is a Timeseries Bar Chart?'),
            },
          },
        ],
      ],
    },
    /**
     * eg:
     * sections.legacyRegularTime,
     * sections.legacyTimeseriesTime,
     */
    // legacyTimeseriesTime for Timeseries Bar Chart，
    // legacyRegularTime is a subset of legacyTimeseriesTime. legacyTimeseriesTime for None-Timeseries Bar Chart temporarily,
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        ['groupby'],
        ['metrics'],
        ['adhoc_filters'],
        [
          {
            name: 'limit',
            config: {
              ...sharedControls.limit,
              visibility: timeseriesVisibility, // for Timeseries Bar Chart
            },
          },
        ],
        ['timeseries_limit_metric'],
        [
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort Descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
            },
          },
        ],
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
        ...legendSection,
        // eslint-disable-next-line react/jsx-key
        [<h1 className="section-header">{t('Axis')}</h1>],
        [
          {
            name: 'x_axis_time_format',
            config: {
              ...sharedControls.x_axis_time_format,
              default: 'smart_date',
              description: `${D3_TIME_FORMAT_DOCS}. ${t(
                'When using other than adaptive formatting, labels may overlap.',
              )}`,
              visibility: timeseriesVisibility, // for Timeseries Bar Chart
            },
          },
        ],
        ['y_axis_format'],
      ],
    },
  ],
  onInit(state: ControlStateMapping) {
    return {
      ...state,
      row_limit: {
        ...state.row_limit,
        value: state.row_limit.default,
      },
    };
  },
};

export default config;
