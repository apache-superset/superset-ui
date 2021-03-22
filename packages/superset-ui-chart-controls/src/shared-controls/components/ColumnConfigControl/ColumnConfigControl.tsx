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
import React, { useMemo } from 'react';
import { debounce } from 'lodash';
import { ChartDataResponseResult, useTheme, t, FAST_DEBOUNCE } from '@superset-ui/core';
import ControlHeader from '../../../components/ControlHeader';
import { ControlComponentProps } from '../types';

import ColumnConfigItem from './ColumnConfigItem';
import { ColumnConfigInfo, ColumnConfig, ColumnConfigFormLayout } from './types';
import { DEFAULT_CONFIG_FORM_LAYOUT } from './constants';

export type ColumnConfigControlProps<T extends ColumnConfig> = ControlComponentProps<
  Record<string, T>
> & {
  queryResponse?: ChartDataResponseResult;
  configFormLayout?: ColumnConfigFormLayout;
};

/**
 * Add per-column config to queried results.
 */
export default function ColumnConfigControl<T extends ColumnConfig>({
  queryResponse,
  value,
  onChange,
  configFormLayout = DEFAULT_CONFIG_FORM_LAYOUT,
  ...props
}: ColumnConfigControlProps<T>) {
  const { colnames, coltypes } = queryResponse || {};
  const theme = useTheme();
  const placeholder = (
    <div css={{ padding: theme.gridUnit, textAlign: 'center', color: theme.colors.grayscale.base }}>
      {t('No known columns yet')}
    </div>
  );
  const columnConfigs = useMemo(() => {
    const configs: Record<string, ColumnConfigInfo> = {};
    colnames?.forEach((col, idx) => {
      configs[col] = {
        name: col,
        type: coltypes?.[idx],
        config: value?.[col] || {},
      };
    });
    return configs;
  }, [value, colnames, coltypes]);

  const getColumnInfo = (col: string) => columnConfigs[col] || {};
  const setColumnConfig = (col: string, config: T) => {
    if (onChange) {
      // Only keep configs for known columns
      const validConfigs: Record<string, T> =
        colnames && value
          ? Object.fromEntries(Object.entries(value).filter(([key]) => colnames.includes(key)))
          : { ...value };
      onChange({
        ...validConfigs,
        [col]: config,
      });
    }
  };

  console.log(value, colnames);

  return (
    <>
      <ControlHeader {...props} />
      <div
        css={{
          border: `1px solid ${theme.colors.grayscale.light2}`,
          borderRadius: theme.gridUnit,
        }}
      >
        {colnames
          ? colnames.map(col => (
              <ColumnConfigItem
                key={col}
                column={getColumnInfo(col)}
                onChange={debounce(config => setColumnConfig(col, config), FAST_DEBOUNCE)}
                configFormLayout={configFormLayout}
              />
            ))
          : placeholder}
      </div>
    </>
  );
}
