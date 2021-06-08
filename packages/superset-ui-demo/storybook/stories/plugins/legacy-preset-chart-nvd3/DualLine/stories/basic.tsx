import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const basic = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="dual-line"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          colorScheme: 'd3Category10',
          vizType: 'dual_line',
          xAxisFormat: '%Y-%m-%d %H:%M:%S',
          yAxis2Format: '.3s',
          yAxisFormat: '.3s',
        }}
      />
    )}
  </ResizableChartDemo>
);
