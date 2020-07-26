import React, { FC, Fragment } from 'react';
import { supersetTheme } from '@superset-ui/style';
import styled from '@superset-ui/style';

type TWaterfallBarProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  __TOTAL__: boolean;
  index: number;
  numberOfBars: number;
};

const ClickableRect = styled.rect`
  cursor: pointer;
`;

const WaterfallBar: FC<TWaterfallBarProps> = ({
  x,
  y,
  width,
  height,
  __TOTAL__,
  index,
  numberOfBars,
}) => {
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
      {index !== numberOfBars - 1 && (
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
      <ClickableRect
        x={x + 0.1 * width}
        y={y}
        width={width - 0.2 * width}
        height={height}
        fill={fill}
      />
    </Fragment>
  );
};

export default WaterfallBar;
