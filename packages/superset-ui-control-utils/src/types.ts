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
/* eslint-disable camelcase */

import { ReactNode, ReactText } from 'react';

export type AnyDict = Record<string, unknown>;

export interface ColumnMeta extends AnyDict {
  column_name: string;
  groupby?: string;
  verbose_name?: string;
  description?: string;
  expression?: string;
  is_dttm?: boolean;
  type?: string;
  filterable?: boolean;
}

export interface DatasourceMeta {
  columns: ColumnMeta[];
  metrics: unknown[];
  type: unknown;
  main_dttm_col: unknown;
  time_grain_sqla: unknown;
}

export interface ControlPanelState {
  form_data: { [key: string]: unknown };
  datasource?: DatasourceMeta | null;
  options?: ColumnMeta[];
  controls?: {
    comparison_type?: {
      value: string;
    };
  };
}

export interface ControlPanelActions {
  setDatasource: Function;
}

/**
 * Additional control props obtained from `mapStateToProps`.
 */
export type ExtraControlProps = AnyDict;

// Ref:superset-frontend/src/explore/store.js
export interface ControlState extends ControlConfig, ExtraControlProps {}

export interface ControlStateMapping {
  [key: string]: ControlState;
}

// Ref: superset-frontend/src/explore/components/ControlPanelsContainer.jsx
export interface ControlPanelsContainerProps extends AnyDict {
  actions: ControlPanelActions;
  controls: ControlStateMapping;
  exportState: AnyDict;
  form_data: AnyDict;
}

/**
 * Meta data for a formData control
 */
export interface ControlConfig {
  type: string;
  label?: string | null;
  description?: string | null;
  // override control panel state props
  mapStateToProps?: (
    state: ControlPanelState,
    control: ControlConfig,
    action: ControlPanelActions,
  ) => ExtraControlProps;
  [key: string]: unknown;
  visibility?: (props: ControlPanelsContainerProps) => boolean;
  queryField?: string;
}

type SelectOption = AnyDict | string | [ReactText, ReactNode];

export interface SelectControlConfig<T extends SelectOption = AnyDict> extends ControlConfig {
  options?: T[];
}

export interface ControlConfigMapping {
  [key: string]: ControlConfig;
}
