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
import React, { ReactNode, ReactText } from 'react';
import sharedControls from './shared-controls';

type AnyDict = Record<string, unknown>;
interface Action {
  type: string;
}
interface AnyAction extends Action, AnyDict {}

/** ----------------------------------------------
 * Input data/props while rendering
 * ---------------------------------------------*/
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
  order_by_choices?: [] | null;
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

/**
 * The action dispather will call Redux `dispatch` internally and return what's
 * returned from `dispatch`, which by default is the original or another action.
 */
export interface ActionDispatcher<ARGS extends unknown[], A extends Action = AnyAction> {
  (...args: ARGS): A;
}

/**
 * Mapping of action dispatchers
 */
export interface ControlPanelActionDispathers {
  setDatasource: ActionDispatcher<[DatasourceMeta]>;
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
  actions: ControlPanelActionDispathers;
  controls: ControlStateMapping;
  exportState: AnyDict;
  form_data: AnyDict;
}

/** ----------------------------------------------
 * Config for a chart Control
 * ---------------------------------------------*/

// Ref: superset-frontend/src/explore/components/controls/index.js
export type InternalControlType =
  | 'AnnotationLayerControl'
  | 'BoundsControl'
  | 'CheckboxControl'
  | 'CollectionControl'
  | 'ColorMapControl'
  | 'ColorPickerControl'
  | 'ColorSchemeControl'
  | 'DatasourceControl'
  | 'DateFilterControl'
  | 'FixedOrMetricControl'
  | 'HiddenControl'
  | 'SelectAsyncControl'
  | 'SelectControl'
  | 'SliderControl'
  | 'SpatialControl'
  | 'TextAreaControl'
  | 'TextControl'
  | 'TimeSeriesColumnControl'
  | 'ViewportControl'
  | 'VizTypeControl'
  | 'MetricsControl'
  | 'AdhocFilterControl'
  | 'FilterBoxItemControl'
  | 'MetricsControlVerifiedOptions'
  | 'SelectControlVerifiedOptions'
  | 'AdhocFilterControlVerifiedOptions';

export interface ControlConfig {
  type: InternalControlType | React.ComponentType;
  label?: ReactNode;
  description?: ReactNode;
  // override control panel state props
  mapStateToProps?: (
    state: ControlPanelState,
    control: ControlConfig,
    actions: ControlPanelActionDispathers,
  ) => ExtraControlProps;
  [key: string]: unknown;
  visibility?: (props: ControlPanelsContainerProps) => boolean;
  queryField?: string;
}

/** --------------------------------------------
 * Additional Config for specific control Types
 * --------------------------------------------- */
type SelectOption = AnyDict | string | [ReactText, ReactNode];

export interface SelectControlConfig<T extends SelectOption = AnyDict> extends ControlConfig {
  options?: T[];
}

export interface ControlConfigMapping {
  [key: string]: ControlConfig;
}

export type SharedControlAlias = keyof typeof sharedControls;

export type SharedSectionAlias =
  | 'annotations'
  | 'colorScheme'
  | 'datasourceAndVizType'
  | 'druidTimeSeries'
  | 'sqlaTimeSeries'
  | 'NVD3TimeSeries';

export interface ControlItem {
  name: SharedControlAlias;
  config: Partial<ControlConfig>;
}

export interface CustomControlItem {
  name: string;
  config: ControlConfig;
}

export type ControlSetItem = SharedControlAlias | ControlItem | CustomControlItem | null;
export type ControlSetRow = ControlSetItem[];

// Ref:
//  - superset-frontend/src/explore/components/ControlPanelsContainer.jsx
//  - superset-frontend/src/explore/components/ControlPanelSection.jsx
export interface ControlPanelSectionConfig {
  label: ReactNode;
  description?: ReactNode;
  expanded?: boolean;
  controlSetRows: ControlSetRow[];
}

export interface ControlPanelConfig {
  controlPanelSections: ControlPanelSectionConfig[];
  controlOverrides?: ControlOverrides;
  sectionOverrides?: SectionOverrides;
}

export type ControlOverrides = {
  [P in SharedControlAlias]?: Partial<ControlConfig>;
};

export type SectionOverrides = {
  [P in SharedSectionAlias]?: Partial<ControlPanelSectionConfig>;
};
