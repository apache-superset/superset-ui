import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const stackedBarWithValues = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="bar"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          barStacked: true,
          bottomMargin: 'auto',
          colorScheme: 'd3Category10',
          contribution: false,
          groupby: ['region'],
          lineInterpolation: 'linear',
          metrics: ['sum__SP_POP_TOTL'],
          richTooltip: true,
          showBarValue: true,
          showBrush: 'auto',
          showControls: false,
          showLegend: true,
          stackedStyle: 'stack',
          vizType: 'bar',
          xAxisFormat: '%Y',
          xAxisLabel: '',
          xAxisShowminmax: false,
          xTicksLayout: 'auto',
          yAxisBounds: [null, null],
          yAxisFormat: '.3s',
          yLogScale: false,
        }}
      />
    )}
  </ResizableChartDemo>
);
