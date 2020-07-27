import React, { FC } from 'react';
import { Text } from 'recharts';

type TWaterfallTickProps = {
  x: number;
  y: number;
  angle: number;
  payload: {
    value: number;
  };
  dy: number;
};

const WaterfallTick: FC<TWaterfallTickProps> = ({ x, y, angle, payload, dy }) => (
  <g transform={`translate(${x},${y})`}>
    <Text
      data-test-id={`tick-${payload.value}`}
      angle={angle}
      dy={dy}
      fontSize={14}
      textAnchor="middle"
      verticalAnchor="start"
      width={100}
    >
      {payload.value}
    </Text>
  </g>
);

export default WaterfallTick;
