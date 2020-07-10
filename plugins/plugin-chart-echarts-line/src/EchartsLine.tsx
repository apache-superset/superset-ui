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
import React, { createRef } from 'react';
import styled, { supersetTheme } from '@superset-ui/style';
import ReactEcharts from 'echarts-for-react';
import { CategoricalColorNamespace } from '@superset-ui/color';
import { getNumberFormatter } from '@superset-ui/number-format';
import { EchartsLineDatum } from './types';
import { DataRecordValue } from '@superset-ui/chart/lib';

interface EchartsLineStylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

export type EchartsLineProps = {
  area: number;
  colorScheme: string;
  contributionMode?: string;
  height: number;
  lineType?: string;
  logAxis: boolean;
  width: number;
  stack: boolean;
  markerEnabled: boolean;
  markerSize: number;
  minorSplitLine: boolean;
  opacity: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: EchartsLineDatum[]; // please add additional typing for your data here
  // add typing here for the props you pass in from transformProps.ts!
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

export default function EchartsLine(props: EchartsLineProps) {
  // height and width are the height and width of the DOM element as it exists in the dashboard.
  // There is also a `data` prop, which is, of course, your DATA 🎉
  const {
    area,
    colorScheme,
    contributionMode,
    data,
    height,
    lineType,
    logAxis,
    opacity,
    stack,
    markerEnabled,
    markerSize,
    minorSplitLine,
    width,
  } = props;
  const colorFn = CategoricalColorNamespace.getScale(colorScheme);
  const rootElem = createRef<HTMLDivElement>();

  // transform data into ECharts friendly format
  const keys = data.length > 0 ? Object.keys(data[0]).filter(key => key !== '__timestamp') : [];

  const rawSeries: Record<string, [Date, DataRecordValue][]> = keys.reduce(
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
      rawSeries[key].push([timestamp, area ? row[key] || 0 : row[key]]);
    });
  });

  const series = [];
  Object.entries(rawSeries).forEach(([key, value]) => {
    series.push({
      color: colorFn(key),
      name: key,
      data: value,
      type: 'line',
      smooth: lineType === 'smooth',
      step: ['start', 'middle', 'end'].includes(lineType) ? lineType : undefined,
      stack: stack ? 'Total' : undefined,
      areaStyle: area ? { opacity } : undefined,
      symbolSize: markerEnabled ? markerSize : 0,
    });
  });

  return (
    <Styles
      ref={rootElem}
      height={height}
      width={width}
    >
      <ReactEcharts
        // needed so previous data is purged when new data comes in
        notMerge
        style={{ height, width }}
        option={{
          grid: {
            top: 60,
            bottom: 60,
            left: 40,
            right: 40,
          },
          xAxis: {
            type: 'time',
          },
          yAxis: {
            type: logAxis ? 'log' : 'value',
            min: contributionMode === 'row' ? 0 : undefined,
            max: contributionMode === 'row' ? 1 : undefined,
            minorTick: { show: true },
            minorSplitLine: { show: minorSplitLine },
            axisLabel: contributionMode ? { formatter: getNumberFormatter(',.0%') } : {},
          },
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: keys,
          },
          series: series,
        }}
      />
    </Styles>
  );
}
