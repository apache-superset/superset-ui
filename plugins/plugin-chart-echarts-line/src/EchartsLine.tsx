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
import styled, { supersetTheme } from '@superset-ui/style';
import ReactEcharts from 'echarts-for-react';

interface EchartsLineStylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

export type EchartsLineProps = {
  height: number;
  width: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<any, any>; // please add additional typing for your data here
  // add typing here for the props you pass in from transformProps.ts!
  boldText: boolean;
  headerFontSize: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl';
  headerText: string;
};

// The following Styles component is a <div> element, which has been styled using Emotion
// For docs, visit https://emotion.sh/docs/styled

// Theming variables are provided for your use via a ThemeProvider
// imported from @superset-ui/style. For variables available, please visit
// https://github.com/apache-superset/superset-ui/blob/master/packages/superset-ui-style/src/index.ts

const Styles = styled.div<EchartsLineStylesProps>`
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  overflow-y: scroll;

  h3 {
    /* You can use your props to control CSS! */
    font-size: ${({ theme, headerFontSize }) => theme.typography.sizes[headerFontSize]};
    font-weight: ${({ theme, boldText }) => theme.typography.weights[boldText ? 'bold' : 'normal']};
  }
`;

/**
 * ******************* WHAT YOU CAN BUILD HERE *******************
 *  In essence, a chart is given a few key ingredients to work with:
 *  * Data: provided via `props.data`
 *  * A DOM element
 *  * FormData (your controls!) provided as props by transformProps.ts
 */

export default function EchartsLine(props: EchartsLineProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const { data, height, width } = props;

  const rootElem = createRef<HTMLDivElement>();

  const keys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== '__timestamp') : [];
  const series = keys.reduce(
    (obj, key) => ({
      ...obj,
      [key]: [],
    }),
    {},
  );
  data.forEach(row => {
    // eslint-disable-next-line no-underscore-dangle
    const timestamp = row.__timestamp;
    keys.forEach(key => {
      series[key].push([timestamp, row[key]]);
    });
  });
  const series2 = [];
  Object.entries(series).forEach(([key, value]) => {
    series2.push({
      name: key,
      data: value,
      type: 'line',
    });
  });
  return (
    <Styles
      ref={rootElem}
      boldText={props.boldText}
      headerFontSize={props.headerFontSize}
      height={height}
      width={width}
    >
      <ReactEcharts
        style={{ height, width }}
        option={{
          xAxis: {
            type: 'time',
          },
          yAxis: {
            type: 'value',
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: keys,
          },
          series: series2,
        }}
      />
    </Styles>
  );
}
