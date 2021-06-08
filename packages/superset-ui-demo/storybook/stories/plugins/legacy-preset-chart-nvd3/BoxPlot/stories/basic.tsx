import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const basic = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="box-plot"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          colorScheme: 'd3Category10',
          vizType: 'box_plot',
          whiskerOptions: 'Min/max (no outliers)',
        }}
      />
    )}
  </ResizableChartDemo>
);
