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
import { Slider } from 'antd';
import { EchartsStylesProps } from '@superset-ui/plugin-chart-echarts/lib/types';

const Styles = styled.div<EchartsStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

export default function AntdRangeFilter(props) {
  // console.log('AntdRangeFilter', props);
  const divRef = useRef<HTMLDivElement>(null);
  const { data, height, width, formData, onAddFilter } = props;
  const [row] = data;
  const { min, max } = row;
  // console.log('!!!', data, formData, onAddFilter);

  const handleChange = (value: [number, number]) => {
    if (onAddFilter) {
      //console.log('yeehaw');
      onAddFilter({ gender: ['male'] }, false);
    }
    //console.log('onChange', value);
  };

  return (
    <Styles ref={divRef} height={height} width={width}>
      <Slider range min={min} max={max} defaultValue={[min, max]} onChange={handleChange} />
    </Styles>
  );
}
