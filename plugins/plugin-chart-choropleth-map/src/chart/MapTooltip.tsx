import React from 'react';
import { isCompleteFieldDef } from 'encodable';
import { uniqBy } from 'lodash';
import { Tooltip } from '@vx/tooltip';
import { TooltipFrame, TooltipTable } from '@superset-ui/chart-composition';
import { ChoroplethMapChannelOutputs, ChoroplethMapEncoder } from './Encoder';

export type TooltipData = ChoroplethMapChannelOutputs & {
  datum: Record<string, unknown>;
};

export type MapTooltipProps = {
  top?: number;
  left?: number;
  encoder: ChoroplethMapEncoder;
  tooltipData?: TooltipData;
};

export default function MapTooltip({ encoder, left, top, tooltipData }: MapTooltipProps) {
  if (!tooltipData) {
    return null;
  }

  const { channels } = encoder;
  const { key, fill, stroke, strokeWidth, opacity } = channels;
  const { datum } = tooltipData;

  const tooltipRows = [
    { key: 'key', keyColumn: key.getTitle(), valueColumn: key.formatDatum(datum) },
  ];

  [fill, stroke, opacity, strokeWidth].forEach(channel => {
    if (isCompleteFieldDef<string | number>(channel.definition)) {
      tooltipRows.push({
        key: channel.name as string,
        keyColumn: channel.getTitle(),
        valueColumn: channel.formatDatum(datum),
      });
    }
  });

  return (
    <Tooltip top={top} left={left}>
      <TooltipFrame>
        <TooltipTable data={uniqBy(tooltipRows, row => row.keyColumn)} />
      </TooltipFrame>
    </Tooltip>
  );
}
