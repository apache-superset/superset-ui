import React from 'react';
import { SuperChart } from '@superset-ui/core';
import dummyDatasource from '../../../../../shared/dummyDatasource';
import data from '../data';
import ResizableChartDemo from '../../../../../shared/components/ResizableChartDemo';

export const basic = () => (
  <ResizableChartDemo>
    {({ width, height }) => (
      <SuperChart
        chartType="bullet"
        width={width}
        height={height}
        datasource={dummyDatasource}
        queriesData={[{ data }]}
        formData={{
          markerLabels: '',
          markerLineLabels: '',
          markerLines: '',
          markers: '',
          rangeLabels: '',
          ranges: '',
          vizType: 'bullet',
        }}
      />
    )}
  </ResizableChartDemo>
);
