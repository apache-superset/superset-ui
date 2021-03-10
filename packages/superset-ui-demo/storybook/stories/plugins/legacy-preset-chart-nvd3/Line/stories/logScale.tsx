import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const logScale = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="line"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          richTooltip: true,
          vizType: 'line',
          yAxisBounds: [1, 60000],
          yAxisFormat: ',d',
          yLogScale: true,
        }}
      />
    )}
  </ResizableChartDemo>
);
