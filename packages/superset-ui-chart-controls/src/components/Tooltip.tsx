import React from 'react';
import { useTheme } from '@superset-ui/core';
import { Tooltip as BaseTooltip } from 'antd';
import { TooltipProps } from 'antd/lib/tooltip';

export const Tooltip = (props: TooltipProps) => {
  const theme = useTheme();
  return (
    <BaseTooltip
      overlayStyle={{ fontSize: theme.typography.sizes.s, lineHeight: '1.6' }}
      color={`${theme.colors.grayscale.dark2}e6`}
      {...props}
    />
  );
};
