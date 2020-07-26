import React from 'react';
import { t } from '@superset-ui/translation';
import styled, { supersetTheme } from '@superset-ui/style';

const LEGEND = [
  { label: t('Increase'), color: supersetTheme.colors.success.base },
  { label: t('Decrease'), color: supersetTheme.colors.error.base },
  { label: t('Total'), color: supersetTheme.colors.info.base },
  { label: t('Other'), color: supersetTheme.colors.alert.base },
];

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

const WaterfallLegend = () => (
  <Legend data-test-id="legend">
    {LEGEND.map(item => (
      <LegendItem key={item.label}>
        <LegendIcon color={item.color} />
        <LegendLabel>{item.label}</LegendLabel>
      </LegendItem>
    ))}
  </Legend>
);

export default WaterfallLegend;
