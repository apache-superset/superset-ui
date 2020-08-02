import React, { FC } from 'react';
import styled from '@superset-ui/style/lib';
import { TooltipProps } from 'recharts';
import { t } from '@superset-ui/translation/lib';

const Container = styled.div`
  border: 1px solid #cccccc;
  background-color: white;
  padding: 10px;
`;

const Line = styled.p`
  color: ${({ color }) => color};
`;

type TPayload = {
  [key: string]: number | undefined;
  rechartsTotal?: number | undefined;
};

const BarChartTooltip: FC<TooltipProps> = ({ active, payload = [], label, ...otherProps }) => {
  if (active) {
    const firstPayload = payload[0]?.payload as TPayload;
    const total = firstPayload?.rechartsTotal;
    return (
      <Container>
        <p>{label}</p>
        {payload.map(item => (
          <Line key={item.name} color={item.color}>{`${item.name} : ${item.value}`}</Line>
        ))}
        {total && <Line color="black">{`${t('Total')} : ${total}`}</Line>}
      </Container>
    );
  }

  return null;
};

export default BarChartTooltip;
