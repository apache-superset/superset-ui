import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const stackedWithYAxisBounds = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="area"
        datasource={dummyDatasource}
        width={width}
        height={height}
        queriesData={[{ data }]}
        formData={{
          bottomMargin: 'auto',
          colorCcheme: 'd3Category10',
          contribution: false,
          groupby: ['region'],
          lineInterpolation: 'linear',
          metrics: ['sum__SP_POP_TOTL'],
          richTooltip: true,
          showBrush: 'auto',
          showControls: false,
          showLegend: true,
          stackedStyle: 'stack',
          vizType: 'area',
          xAxisFormat: '%Y',
          xAxisLabel: '',
          xAxisShowminmax: false,
          xTicksLayout: 'auto',
          yAxisBounds: [0, 3000000000],
          yAxisFormat: '.3s',
          yLogScale: false,
        }}
      />
    )}
  </ResizableChartDemo>
);

stackedWithYAxisBounds.story = {
  name: 'Stacked with yAxisBounds',
};

export const stackedWithYAxisBoundsMinOnly = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="area"
        datasource={dummyDatasource}
        width={width}
        height={height}
        queriesData={[{ data }]}
        formData={{
          bottomMargin: 'auto',
          colorCcheme: 'd3Category10',
          contribution: false,
          groupby: ['region'],
          lineInterpolation: 'linear',
          metrics: ['sum__SP_POP_TOTL'],
          richTooltip: true,
          showBrush: 'auto',
          showControls: true,
          showLegend: true,
          stackedStyle: 'stack',
          vizType: 'area',
          xAxisFormat: '%Y',
          xAxisLabel: '',
          xAxisShowminmax: false,
          xTicksLayout: 'auto',
          yAxisBounds: [1000000000, null],
          yAxisFormat: '.3s',
          yLogScale: false,
        }}
      />
    )}
  </ResizableChartDemo>
);

stackedWithYAxisBoundsMinOnly.story = {
  name: 'Stacked with yAxisBounds min only',
};
