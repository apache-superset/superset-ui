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
import React, { useEffect, createRef } from 'react';
import styled from '@superset-ui/style';
import echarts from 'echarts';
import { EchartsTimeseriesProps } from './types';

interface EchartsLineStylesProps {
  height: number;
  width: number;
}

const Styles = styled.div<EchartsLineStylesProps>`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
`;

export default function EchartsTimeseries(props: EchartsTimeseriesProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { echartOptions, height, width } = props;
  const rootElem = createRef<HTMLDivElement>();

  useEffect(() => {
    const root = rootElem.current as HTMLDivElement;
    const myChart = echarts.init(root);
    myChart.setOption(echartOptions, true);
    myChart.resize();
  });

  return <Styles ref={rootElem} height={height} width={width} />;
}
