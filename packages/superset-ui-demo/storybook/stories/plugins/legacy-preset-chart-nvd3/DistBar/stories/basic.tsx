import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const basic = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="dist-bar"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          barstacked: false,
          bottomMargin: 'auto',
          colorScheme: 'd3Category10',
          contribution: false,
          orderBars: false,
          reduceXTicks: false,
          showBarValue: false,
          showControls: false,
          showLegend: true,
          vizType: 'dist_bar',
          xAxisLabel: 'ddd',
          xTicksLayout: 'auto',
          yAxisFormat: '.3s',
          yAxisLabel: 'ddd',
        }}
      />
    )}
  </ResizableChartDemo>
);
