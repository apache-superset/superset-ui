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
import React, { createRef, useEffect } from 'react';
import styled from '@superset-ui/style';
import echarts from 'echarts';
import { EchartsProps, EchartsStylesProps } from '../types';

const Styles = styled.div<EchartsStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

export default function useEchartsComponent(props: EchartsProps) {
  const { height, width, echartOptions } = props;

  const rootElem = createRef<HTMLDivElement>();

  useEffect(() => {
    const root = rootElem.current as HTMLDivElement;
    const myChart = echarts.init(root, undefined, {
      width,
      height,
    });
    myChart.setOption(echartOptions, true);
    myChart.resize({
      width,
      height,
    });
  });

  return <Styles ref={rootElem} height={height} width={width} />;
}
