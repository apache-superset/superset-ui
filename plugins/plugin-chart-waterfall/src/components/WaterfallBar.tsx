import React, { FC } from 'react';
import { supersetTheme, styled } from '@superset-ui/style';
import { BarProps } from 'recharts';

interface IWaterfallBarProps extends BarProps {
  __TOTAL__?: boolean;
  numberOfBars?: number;
  index?: number;
}

const ClickableRect = styled.rect`
  cursor: pointer;
`;

const WaterfallBar: FC<IWaterfallBarProps> = ({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  __TOTAL__,
  index = 0,
  numberOfBars = 0,
}) => {
  const isNegative = height < 0;
  // eslint-disable-next-line no-negated-condition
  let fill = !isNegative ? supersetTheme.colors.success.base : supersetTheme.colors.error.base;
  if (__TOTAL__) {
    fill = supersetTheme.colors.info.base;
  }
  if (isNegative) {
    // eslint-disable-next-line no-param-reassign
    y += height;
    // eslint-disable-next-line no-param-reassign
    height = Math.abs(height);
  }
  // eslint-disable-next-line no-negated-condition
  const lineY = !isNegative ? y : y + height;
  return (
    <>
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
    </>
  );
};

export default WaterfallBar;
