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
import React, { createRef, FC, useState } from 'react';
import { t } from '@superset-ui/translation';
import styled from '@superset-ui/style';
import { BarChart, Bar, LabelList, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import WaterfallTick from './WaterfallTick';
import { valueFormatter } from './utils';
import WaterfallBar from './WaterfallBar';
import WaterfallLegend from './WaterfallLegend';

type TWaterfallStylesProps = {
  height: number;
  width: number;
};

export type TBarValue = { value: [number, number] };

export type TWaterfallData = {
  [key: string]: string | boolean | TBarValue;
};

export type TWaterfallProps = {
  xAxisDataKey?: string;
  dataKey: string;
  error?: string;
  height: number;
  resetFilters?: Function;
  onBarClick?: Function;
  width: number;
  data?: TWaterfallData[]; // please add additional typing for your data here
};

const Styles = styled.div<TWaterfallStylesProps>`
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
    font-size: ${({ theme }) => theme.typography.sizes.xxl};
    font-weight: bold;
  }
`;

const Error = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.warning.dark1};
  background-color: ${({ theme }) => theme.colors.warning.light1};
`;

const Notification = styled.div`
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.gridUnit * 4}px;
  border-radius: ${({ theme }) => theme.gridUnit * 2}px;
  color: ${({ theme }) => theme.colors.info.dark1};
  background-color: ${({ theme }) => theme.colors.info.light1};
`;

const Waterfall: FC<TWaterfallProps> = ({
  onBarClick = () => {},
  xAxisDataKey,
  dataKey,
  data,
  height,
  width,
  error,
}) => {
  const rootElem = createRef<HTMLDivElement>();
  const [notification, setNotification] = useState<string | null>(null);

  const handleBarClick = (barData: TWaterfallData) => {
    onBarClick(barData);
    setNotification(t('Bar was clicked, filter will be emitted on a dashboard'));
  };
  const closeNotification = () => setNotification(null);

  const renderLabel: (barValue: TBarValue) => string = ({ value }) =>
    valueFormatter(value[1] - value[0]);

  return (
    <Styles ref={rootElem} height={height} width={width}>
      {notification && <Notification onClick={closeNotification}>{notification}</Notification>}
      {error ? (
        <Error>{error}</Error>
      ) : (
        <div>
          <WaterfallLegend />
          <BarChart
            margin={{ bottom: 100, top: 20 }}
            width={width - 20}
            height={height - 100}
            data={data}
            barCategoryGap={0}
          >
            <CartesianGrid vertical={false} />
            <XAxis dataKey={xAxisDataKey} dy={30} angle={45} tick={WaterfallTick} interval={0} />
            <YAxis tickFormatter={valueFormatter} />
            <Tooltip />
            <Bar
              dataKey={dataKey}
              shape={props => (
                // @ts-ignore
                <WaterfallBar {...props} numberOfBars={data?.length} />
              )}
              onClick={handleBarClick}
            >
              {/*
              // @ts-ignore */}
              <LabelList dataKey={dataKey} position="top" content={renderLabel} />
            </Bar>
          </BarChart>
        </div>
      )}
    </Styles>
  );
};
export default Waterfall;
