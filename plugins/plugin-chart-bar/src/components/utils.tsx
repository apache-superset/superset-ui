import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getNumberFormatter } from '@superset-ui/number-format';
import { LabelProps } from 'recharts';
// eslint-disable-next-line import/no-extraneous-dependencies
import { NumberFormatFunction } from '@superset-ui/number-format/lib/types';
import { TResultData } from '../plugin/transformProps';
// eslint-disable-next-line import/no-extraneous-dependencies
import BarChartTick, { TBarChartTickProps } from './BarChartTick';

export enum ELayout {
  horizontal = 'horizontal',
  vertical = 'vertical',
}

export const MAX_SYMBOLS_IN_TICK_LABEL = 20;
export const MIN_BAR_SIZE_FOR_LABEL = 18;
export const MIN_SYMBOL_WIDTH_FOR_LABEL = 14;
export const MIN_SYMBOL_WIDTH_FOR_TICK_LABEL = 8;
export const MIN_LABEL_MARGIN = 20;

type TAxisProps = {
  layout: ELayout;
  angle: number;
  label: string;
  dataKeyLength: number;
  metricLength: number;
  numbersFormat: string;
};

export const getXAxisProps = ({
  layout,
  angle,
  label,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: TAxisProps) => {
  const textAnchor = angle === 0 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    offset: 10,
    value: label,
    position: 'bottom',
  };
  const params = {
    dy: 5,
    label: labelProps,
    angle,
  };
  switch (layout) {
    case ELayout.vertical:
      return {
        ...params,
        tick: (props: TBarChartTickProps) => (
          <BarChartTick
            {...props}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
          />
        ),
        height: angle === 0 ? MIN_LABEL_MARGIN : metricLength,
        type: 'number' as const,
      };
    case ELayout.horizontal:
    default:
      return {
        ...params,
        tick: (props: TBarChartTickProps) => <BarChartTick {...props} textAnchor={textAnchor} />,
        height: angle === 0 ? MIN_LABEL_MARGIN : dataKeyLength,
        interval: 0,
        dataKey: 'rechartsDataKey',
      };
  }
};

export const getYAxisProps = ({
  layout,
  angle,
  label,
  dataKeyLength,
  metricLength,
  numbersFormat,
}: TAxisProps) => {
  const textAnchor = angle === -90 ? 'middle' : 'end';
  const labelProps: LabelProps = {
    offset: 10,
    value: label,
    angle: 90,
    position: 'left',
  };
  const params = {
    dx: -5,
    angle,
    label: labelProps,
  };
  switch (layout) {
    case ELayout.vertical:
      return {
        ...params,
        tick: (props: TBarChartTickProps) => <BarChartTick {...props} textAnchor={textAnchor} />,
        width: angle === -90 ? MIN_LABEL_MARGIN : dataKeyLength,
        dataKey: 'rechartsDataKey',
        type: 'category' as const,
      };
    case ELayout.horizontal:
    default:
      return {
        ...params,
        width: angle === -90 ? MIN_LABEL_MARGIN : metricLength,
        tick: (props: TBarChartTickProps) => (
          <BarChartTick
            {...props}
            textAnchor={textAnchor}
            tickFormatter={getNumberFormatter(numbersFormat)}
          />
        ),
      };
  }
};

export const getCartesianGridProps = ({ layout }: { layout: ELayout }) => {
  switch (layout) {
    case ELayout.vertical:
      return {
        horizontal: false,
      };
    case ELayout.horizontal:
    default:
      return {
        vertical: false,
      };
  }
};

export const getMaxLengthOfDataKey = (data: TResultData[]) =>
  Math.min(Math.max(...data.map(item => item.rechartsDataKey.length)), MAX_SYMBOLS_IN_TICK_LABEL);

export const getMaxLengthOfMetric = (
  data: TResultData[],
  metrics: string[],
  formatter: NumberFormatFunction = value => `${value}`,
) =>
  Math.max(
    ...data.map(
      item =>
        (formatter(
          Math.abs(metrics.reduce((total, metric) => total + (item[metric] as number), 0)),
        ) as string).length,
    ),
  );

export const renderLabel = ({
  formatter = value => `${value}`,
  value = 0,
  width: labelWidth = 0,
  height: labelHeight = 0,
}: LabelProps) => {
  const formattedValue = formatter(value) as string;
  if (
    Math.abs(labelHeight) < MIN_BAR_SIZE_FOR_LABEL ||
    Math.abs(labelWidth) < formattedValue.length * MIN_SYMBOL_WIDTH_FOR_LABEL
  ) {
    return '';
  }
  return formattedValue;
};
