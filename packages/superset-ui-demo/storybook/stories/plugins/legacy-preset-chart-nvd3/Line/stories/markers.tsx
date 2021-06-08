import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const markers = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="line"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          bottomMargin: 'auto',
          colorScheme: 'd3Category10',
          leftMargin: 'auto',
          lineInterpolation: 'linear',
          richTooltip: true,
          showBrush: 'auto',
          showLegend: true,
          showMarkers: true,
          vizType: 'line',
          xAxisFormat: 'smart_date',
          xAxisLabel: '',
          xAxisShowminmax: false,
          xTicksLayout: 'auto',
          yAxisBounds: [null, null],
          yAxisFormat: '.3s',
          yAxisLabel: '',
          yAxisShowminmax: false,
          yLogScale: false,
        }}
      />
    )}
  </ResizableChartDemo>
);
