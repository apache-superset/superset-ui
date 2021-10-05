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
import {
  ColumnOption,
  ControlConfig,
  ControlPanelConfig,
  ControlPanelsContainerProps,
  ControlPanelState,
  ControlState,
  ControlStateMapping,
  CustomControlConfig,
  emitFilterControl,
  ExtraControlProps,
  QueryModeLabel,
  sections,
  sharedControls,
} from '@superset-ui/chart-controls';
import {
  addLocaleData,
  ensureIsArray,
  FeatureFlag,
  isFeatureEnabled,
  QueryFormColumn,
  QueryMode,
  t,
  validateNonEmpty,
} from '@superset-ui/core';
import React, { ReactNode } from 'react';
import { CodeEditor } from '../components/CodeEditor/CodeEditor';
import { PAGE_SIZE_OPTIONS } from '../consts';
import i18n from '../i18n';

addLocaleData(i18n);

function getQueryMode(controls: ControlStateMapping): QueryMode {
  const mode = controls?.query_mode?.value;
  if (mode === QueryMode.aggregate || mode === QueryMode.raw) {
    return mode as QueryMode;
  }
  const rawColumns = controls?.all_columns?.value as QueryFormColumn[] | undefined;
  const hasRawColumns = rawColumns && rawColumns.length > 0;
  return hasRawColumns ? QueryMode.raw : QueryMode.aggregate;
}

/**
 * Visibility check
 */
function isQueryMode(mode: QueryMode) {
  return ({ controls }: Pick<ControlPanelsContainerProps, 'controls'>) =>
    getQueryMode(controls) === mode;
}

const isAggMode = isQueryMode(QueryMode.aggregate);
const isRawMode = isQueryMode(QueryMode.raw);

const validateAggControlValues = (controls: ControlStateMapping, values: any[]) => {
  const areControlsEmpty = values.every(val => ensureIsArray(val).length === 0);
  return areControlsEmpty && isAggMode({ controls })
    ? [t('Group By, Metrics or Percentage Metrics must have a value')]
    : [];
};

const queryMode: ControlConfig<'RadioButtonControl'> = {
  type: 'RadioButtonControl',
  label: t('Query mode'),
  default: null,
  options: [
    [QueryMode.aggregate, QueryModeLabel[QueryMode.aggregate]],
    [QueryMode.raw, QueryModeLabel[QueryMode.raw]],
  ],
  mapStateToProps: ({ controls }) => ({ value: getQueryMode(controls) }),
  rerender: ['all_columns', 'groupby', 'metrics', 'percent_metrics'],
};

interface ControlHeaderProps {
  children: ReactNode;
}
const ControlHeader = ({ children }: ControlHeaderProps): JSX.Element => {
  return (
    <div className="ControlHeader">
      <div className="pull-left">
        <label>
          <span role={'button'}>{children}</span>
        </label>
      </div>
    </div>
  );
};

interface HandlebarsCustomControlProps {
  value: string;
}
const HandlbarsTemplateControl = (props: CustomControlConfig<HandlebarsCustomControlProps>) => {
  const val = String(props?.value ? props?.value : props?.default ? props?.default : '');

  const updateConfig = (source: string) => {
    console.log('calling onChange handler', source);
    props.onChange(source);
  };
  return (
    <div>
      <ControlHeader>{props.label}</ControlHeader>
      <CodeEditor
        theme="dark"
        value={val}
        onChange={(source, action) => {
          console.log('onChange', source, action);
          updateConfig(source || '');
        }}
      />
    </div>
  );
};
const handlebarsTemplate: ControlConfig<any> = {
  ...sharedControls.entity,
  type: HandlbarsTemplateControl,
  valueKey: 'handlebars_template',
  label: t('Handlebars Template'),
  description: t('A handlebars template that is applied to the data'),
  default: `<ul class="data_list">
  {{#each data}}
    <li>{{this}}</li>
  {{/each}}
</ul>`,
  isInt: false,
  validators: [validateNonEmpty],
  mapStateToProps: ({ controls }) => ({
    value: controls?.handlebars_template?.value,
  }),
};

const all_columns: typeof sharedControls.groupby = {
  type: 'SelectControl',
  label: t('Columns'),
  description: t('Columns to display'),
  multi: true,
  freeForm: true,
  allowAll: true,
  commaChoosesOption: false,
  default: [],
  optionRenderer: c => <ColumnOption showType column={c} />,
  valueRenderer: c => <ColumnOption column={c} />,
  valueKey: 'column_name',
  mapStateToProps: ({ datasource, controls }, controlState) => ({
    options: datasource?.columns || [],
    queryMode: getQueryMode(controls),
    externalValidationErrors:
      isRawMode({ controls }) && ensureIsArray(controlState.value).length === 0
        ? [t('must have a value')]
        : [],
  }),
  visibility: isRawMode,
};

const dnd_all_columns: typeof sharedControls.groupby = {
  type: 'DndColumnSelect',
  label: t('Columns'),
  description: t('Columns to display'),
  default: [],
  mapStateToProps({ datasource, controls }, controlState) {
    const newState: ExtraControlProps = {};
    if (datasource) {
      const options = datasource.columns;
      newState.options = Object.fromEntries(options.map(option => [option.column_name, option]));
    }
    newState.queryMode = getQueryMode(controls);
    newState.externalValidationErrors =
      isRawMode({ controls }) && ensureIsArray(controlState.value).length === 0
        ? [t('must have a value')]
        : [];
    return newState;
  },
  visibility: isRawMode,
};

const percent_metrics: typeof sharedControls.metrics = {
  type: 'MetricsControl',
  label: t('Percentage metrics'),
  description: t(
    'Metrics for which percentage of total are to be displayed. Calculated from only data within the row limit.',
  ),
  multi: true,
  visibility: isAggMode,
  mapStateToProps: ({ datasource, controls }, controlState) => ({
    columns: datasource?.columns || [],
    savedMetrics: datasource?.metrics || [],
    datasourceType: datasource?.type,
    queryMode: getQueryMode(controls),
    externalValidationErrors: validateAggControlValues(controls, [
      controls.groupby?.value,
      controls.metrics?.value,
      controlState.value,
    ]),
  }),
  rerender: ['groupby', 'metrics'],
  default: [],
  validators: [],
};

const dnd_percent_metrics = {
  ...percent_metrics,
  type: 'DndMetricSelect',
};

const config: ControlPanelConfig = {
  /**
   * The control panel is split into two tabs: "Query" and
   * "Chart Options". The controls that define the inputs to
   * the chart data request, such as columns and metrics, usually
   * reside within "Query", while controls that affect the visual
   * appearance or functionality of the chart are under the
   * "Chart Options" section.
   *
   * There are several predefined controls that can be used.
   * Some examples:
   * - groupby: columns to group by (tranlated to GROUP BY statement)
   * - series: same as groupby, but single selection.
   * - metrics: multiple metrics (translated to aggregate expression)
   * - metric: sane as metrics, but single selection
   * - adhoc_filters: filters (translated to WHERE or HAVING
   *   depending on filter type)
   * - row_limit: maximum number of rows (translated to LIMIT statement)
   *
   * If a control panel has both a `series` and `groupby` control, and
   * the user has chosen `col1` as the value for the `series` control,
   * and `col2` and `col3` as values for the `groupby` control,
   * the resulting query will contain three `groupby` columns. This is because
   * we considered `series` control a `groupby` query field and its value
   * will automatically append the `groupby` field when the query is generated.
   *
   * It is also possible to define custom controls by importing the
   * necessary dependencies and overriding the default parameters, which
   * can then be placed in the `controlSetRows` section
   * of the `Query` section instead of a predefined control.
   *
   * import { validateNonEmpty } from '@superset-ui/core';
   * import {
   *   sharedControls,
   *   ControlConfig,
   *   ControlPanelConfig,
   * } from '@superset-ui/chart-controls';
   *
   * const myControl: ControlConfig<'SelectControl'> = {
   *   name: 'secondary_entity',
   *   config: {
   *     ...sharedControls.entity,
   *     type: 'SelectControl',
   *     label: t('Secondary Entity'),
   *     mapStateToProps: state => ({
   *       sharedControls.columnChoices(state.datasource)
   *       .columns.filter(c => c.groupby)
   *     })
   *     validators: [validateNonEmpty],
   *   },
   * }
   *
   * In addition to the basic drop down control, there are several predefined
   * control types (can be set via the `type` property) that can be used. Some
   * commonly used examples:
   * - SelectControl: Dropdown to select single or multiple values,
       usually columns
   * - MetricsControl: Dropdown to select metrics, triggering a modal
       to define Metric details
   * - AdhocFilterControl: Control to choose filters
   * - CheckboxControl: A checkbox for choosing true/false values
   * - SliderControl: A slider with min/max values
   * - TextControl: Control for text data
   *
   * For more control input types, check out the `incubator-superset` repo
   * and open this file: superset-frontend/src/explore/components/controls/index.js
   *
   * To ensure all controls have been filled out correctly, the following
   * validators are provided
   * by the `@superset-ui/core/lib/validator`:
   * - validateNonEmpty: must have at least one value
   * - validateInteger: must be an integer value
   * - validateNumber: must be an intger or decimal value
   */

  // For control input types, see: superset-frontend/src/explore/components/controls/index.js
  controlPanelSections: [
    sections.legacyTimeseriesTime,
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'query_mode',
            config: queryMode,
          },
        ],
        [
          {
            name: 'groupby',
            override: {
              visibility: isAggMode,
              mapStateToProps: (state: ControlPanelState, controlState: ControlState) => {
                const { controls } = state;
                const originalMapStateToProps = sharedControls?.groupby?.mapStateToProps;
                const newState = originalMapStateToProps?.(state, controlState) ?? {};
                newState.externalValidationErrors = validateAggControlValues(controls, [
                  controls.metrics?.value,
                  controls.percent_metrics?.value,
                  controlState.value,
                ]);

                return newState;
              },
              rerender: ['metrics', 'percent_metrics'],
            },
          },
        ],
        [
          {
            name: 'metrics',
            override: {
              validators: [],
              visibility: isAggMode,
              mapStateToProps: (
                { controls, datasource, form_data }: ControlPanelState,
                controlState: ControlState,
              ) => ({
                columns: datasource?.columns.filter(c => c.filterable) || [],
                savedMetrics: datasource?.metrics || [],
                // current active adhoc metrics
                selectedMetrics: form_data.metrics || (form_data.metric ? [form_data.metric] : []),
                datasource,
                externalValidationErrors: validateAggControlValues(controls, [
                  controls.groupby?.value,
                  controls.percent_metrics?.value,
                  controlState.value,
                ]),
              }),
              rerender: ['groupby', 'percent_metrics'],
            },
          },
          {
            name: 'all_columns',
            config: isFeatureEnabled(FeatureFlag.ENABLE_EXPLORE_DRAG_AND_DROP)
              ? dnd_all_columns
              : all_columns,
          },
        ],
        [
          {
            name: 'percent_metrics',
            config: {
              ...(isFeatureEnabled(FeatureFlag.ENABLE_EXPLORE_DRAG_AND_DROP)
                ? dnd_percent_metrics
                : percent_metrics),
            },
          },
        ],
        [
          {
            name: 'timeseries_limit_metric',
            override: {
              visibility: isAggMode,
            },
          },
          {
            name: 'order_by_cols',
            config: {
              type: 'SelectControl',
              label: t('Ordering'),
              description: t('Order results by selected columns'),
              multi: true,
              default: [],
              mapStateToProps: ({ datasource }) => ({
                choices: datasource?.order_by_choices || [],
              }),
              visibility: isRawMode,
            },
          },
        ],
        isFeatureEnabled(FeatureFlag.DASHBOARD_CROSS_FILTERS) ||
        isFeatureEnabled(FeatureFlag.DASHBOARD_NATIVE_FILTERS)
          ? [
              {
                name: 'server_pagination',
                config: {
                  type: 'CheckboxControl',
                  label: t('Server pagination'),
                  description: t('Enable server side pagination of results (experimental feature)'),
                  default: false,
                },
              },
            ]
          : [],
        [
          {
            name: 'row_limit',
            override: {
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                !controls?.server_pagination?.value,
            },
          },
          {
            name: 'server_page_length',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Server Page Length'),
              default: 10,
              choices: PAGE_SIZE_OPTIONS,
              description: t('Rows per page, 0 means no pagination'),
              visibility: ({ controls }: ControlPanelsContainerProps) =>
                Boolean(controls?.server_pagination?.value),
            },
          },
        ],
        [
          {
            name: 'include_time',
            config: {
              type: 'CheckboxControl',
              label: t('Include time'),
              description: t(
                'Whether to include the time granularity as defined in the time section',
              ),
              default: false,
              visibility: isAggMode,
            },
          },
          {
            name: 'order_desc',
            config: {
              type: 'CheckboxControl',
              label: t('Sort descending'),
              default: true,
              description: t('Whether to sort descending or ascending'),
              visibility: isAggMode,
            },
          },
        ],
        [
          {
            name: 'show_totals',
            config: {
              type: 'CheckboxControl',
              label: t('Show totals'),
              default: false,
              description: t(
                'Show total aggregations of selected metrics. Note that row limit does not apply to the result.',
              ),
              visibility: isAggMode,
            },
          },
        ],
        ['adhoc_filters'],
        emitFilterControl,
      ],
    },
    {
      label: t('Options'),
      expanded: true,
      controlSetRows: [
        [
          {
            name: 'handlebars_template',
            config: handlebarsTemplate,
          },
        ],
      ],
    },
  ],
};

export default config;
