import React, { FC } from 'react';
import { Text } from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NumberFormatter } from '@superset-ui/number-format';
import { MAX_SYMBOLS_IN_TICK_LABEL } from './utils';

export type TBarChartTickProps = {
  x: number;
  y: number;
  angle?: number;
  textAnchor?: 'start' | 'middle' | 'end' | 'inherit';
  width?: number;
  tickFormatter?: NumberFormatter;
  payload: {
    value: number | string;
  };
  dy?: number;
  dx?: number;
};

const BarChartTick: FC<TBarChartTickProps> = ({
  x,
  y,
  angle,
  payload,
  dy,
  dx,
  textAnchor = 'end',
  tickFormatter = value => value,
}) => {
  let text;
  if (typeof payload.value === 'number') {
    text = tickFormatter(payload.value) as string;
  } else {
    text = `${payload.value}`;
  }
  text =
    text.length > MAX_SYMBOLS_IN_TICK_LABEL
      ? `${text.slice(0, MAX_SYMBOLS_IN_TICK_LABEL)}...`
      : text;
  return (
    <g transform={`translate(${x},${y})`} data-test-id={`tick-${text}`}>
      <Text
        angle={angle}
        dy={dy}
        dx={dx}
        fontSize={12}
        verticalAnchor="middle"
        textAnchor={textAnchor}
      >
        {text}
      </Text>
    </g>
  );
};

export default BarChartTick;
