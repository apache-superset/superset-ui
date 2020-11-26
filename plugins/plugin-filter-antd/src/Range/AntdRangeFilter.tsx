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
import { AntdPluginFilterRangeProps } from './types';
import { AntdPluginFilterStylesProps } from '../types';

const Styles = styled.div<AntdPluginFilterStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

export default function AntdRangeFilter(props: AntdPluginFilterRangeProps) {
  const divRef = useRef<HTMLDivElement>(null);
  const { data, height, width, setRangeValues } = props;
  const [row] = data;
  // @ts-ignore
  const { min, max }: { min: number; max: number } = row;

  const handleChange = (value: [number, number]) => {
    const [lower, upper] = value;
    if (setRangeValues) {
      setRangeValues({ lower, upper });
    }
  };

  return (
    <Styles ref={divRef} height={height} width={width}>
      <Slider range min={min} max={max} defaultValue={[min, max]} onChange={handleChange} />
    </Styles>
  );
}
