import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const basic = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="compare"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          bottomMargin: 'auto',
          colorScheme: 'd3Category10',
          contribution: false,
          leftMargin: 'auto',
          vizType: 'compare',
          xAxisFormat: '%Y-%m-%d %H:%M:%S',
          xAxisLabel: '',
          xAxisShowminmax: false,
          xTicksLayout: 'auto',
          yAxisBounds: [null, null],
          yAxisFormat: '.3s',
          yAxisLabel: '',
          yAxisShowminmax: false,
          yLogscale: false,
        }}
      />
    )}
  </ResizableChartDemo>
);
