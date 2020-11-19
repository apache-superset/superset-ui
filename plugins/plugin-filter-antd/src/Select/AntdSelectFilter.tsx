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
import { styled } from '@superset-ui/core';
import React, { useRef } from 'react';
import { Select } from 'antd';
import { DEFAULT_FORM_DATA, PluginFilterSelectProps } from './types';
import { EchartsStylesProps } from '@superset-ui/plugin-chart-echarts/lib/types';

const Styles = styled.div<EchartsStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

const { Option } = Select;

export default function PluginFilterSelect(props: PluginFilterSelectProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const DELIMITER = '!^&@%#*!@';
  const { data, formData, height, width, setSelectFilter } = props;
  const { multiSelect, showSearch } = { ...DEFAULT_FORM_DATA, ...formData };
  let { groupby = [] } = formData;
  groupby = Array.isArray(groupby) ? groupby : [groupby];
  // console.log('height width', height, width, hooks);

  function handleChange(value: string | string[]) {
    const values = Array.isArray(value) ? value : [value];
    setSelectFilter(values);
  }

  return (
    <Styles ref={divRef} height={height} width={width}>
      <Select
        allowClear
        showSearch={showSearch}
        style={{ width: width - 4 }}
        mode={multiSelect ? 'multiple' : undefined}
        onChange={handleChange}
      >
        {(data || []).map(row => {
          const values = groupby.map(col => row[col]);
          const key = values.join(DELIMITER);
          const label = values.join(', ');
          return (
            <Option key={key} value={key}>
              {label}
            </Option>
          );
        })}
      </Select>
    </Styles>
  );
}
