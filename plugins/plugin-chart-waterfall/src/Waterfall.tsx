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
import React, { useEffect, createRef, Fragment, FC } from 'react';
import { t } from '@superset-ui/translation';
import styled, { supersetTheme } from '@superset-ui/style';
import { BarChart, Bar, LabelList, XAxis, YAxis, Text, CartesianGrid, Tooltip } from 'recharts';

interface WaterfallStylesProps {
  height: number;
  width: number;
  headerFontSize: keyof typeof supersetTheme.typography.sizes;
  boldText: boolean;
}

export type WaterfallProps = {
  xAxisDataKey: string;
  dataKey: string;
  error: string;
  height: number;
  resetFilters: Function;
  onBarClick: Function;
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

const Styles = styled.div<WaterfallStylesProps>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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

const Legend = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
  & > * {
    margin-left: 10px;
  }
`;

const LegendItem = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: no-wrap;
`;

const LegendIcon = styled.div`
  margin-right: 5px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ theme, color }) => color};
`;

const LegendLabel = styled.div`
  line-height: 0;
  font-size: ${({ theme }) => theme.typography.sizes.l};
`;

const Error = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.warning.dark1};
  background-color: ${({ theme }) => theme.colors.warning.light1};
`;

const Toolbar = styled.div`
  display: flex;
  width: 100%
  justify-content: center;
  align-items: center;
`;

const LEGEND = [
  { label: t('Increase'), color: supersetTheme.colors.success.base },
  { label: t('Decrease'), color: supersetTheme.colors.error.base },
  { label: t('Total'), color: supersetTheme.colors.info.base },
  { label: t('Other'), color: supersetTheme.colors.alert.base },
];

const valueFormatter = (value: number) => {
  if (Math.abs(Math.round(value / 1000000)) >= 1) {
    return `${(value / 1000000).toFixed(1)}M`;
  }
  if (Math.abs(Math.round(value / 1000)) >= 1) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value;
};

const Waterfall: FC<WaterfallProps> = ({
  onBarClick,
  resetFilters,
  xAxisDataKey,
  dataKey,
  data,
  height,
  width,
  error,
  boldText,
  headerFontSize,
}) => {
  const rootElem = createRef<HTMLDivElement>();

  const renderBar = ({ x, y, width, height, __TOTAL__, index, value, ...otherProps }) => {
    const isNegative = height < 0;
    let fill = height > 0 ? supersetTheme.colors.success.base : supersetTheme.colors.error.base;
    if (__TOTAL__) {
      fill = supersetTheme.colors.info.base;
    }
    if (isNegative) {
      y = y + height;
      height = Math.abs(height);
    }
    const lineY = !isNegative ? y : y + height;
    return (
      <Fragment>
        {index !== data.length - 1 && (
          <line
            x1={x + 0.1 * width}
            y1={lineY}
            x2={x + 2 * width - 0.1 * width}
            y2={lineY}
            style={{
              stroke: supersetTheme.colors.grayscale.base,
              strokeWidth: 1,
            }}
          />
        )}
        <rect x={x + 0.1 * width} y={y} width={width - 0.2 * width} height={height} fill={fill} />
      </Fragment>
    );
  };
  const renderLabel = ({ value }) => valueFormatter(value[1] - value[0]);
  const renderTick = ({ x, y, stroke, payload }) => (
    <g transform={`translate(${x},${y})`}>
      <Text angle={35} dy={20} fontSize={14} textAnchor="middle" verticalAnchor="start" width={80}>
        {payload.value}
      </Text>
    </g>
  );
  return (
    <Styles
      ref={rootElem}
      boldText={boldText}
      headerFontSize={headerFontSize}
      height={height}
      width={width}
    >
      {error ? (
        <Error>{error}</Error>
      ) : (
        <div>
          <Toolbar>
            <button onClick={resetFilters}>{t('Reset filters')}</button>
          </Toolbar>
          <Legend>
            {LEGEND.map(item => (
              <LegendItem>
                <LegendIcon color={item.color} />
                <LegendLabel>{item.label}</LegendLabel>
              </LegendItem>
            ))}
          </Legend>
          <BarChart
            margin={{ bottom: 80, top: 20 }}
            width={width - 20}
            height={height - 100}
            data={data}
            barCategoryGap={0}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xAxisDataKey} dy={20} angle={30} tick={renderTick} interval={0} />
            <YAxis tickFormatter={valueFormatter} />
            <Tooltip />
            <Bar onClick={onBarClick} dataKey={dataKey} shape={renderBar}>
              <LabelList dataKey={dataKey} position="top" content={renderLabel} />
            </Bar>
          </BarChart>
        </div>
      )}
    </Styles>
  );
};
export default Waterfall;
