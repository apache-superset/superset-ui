/* eslint-disable no-magic-numbers */
import React from 'react';
import { SuperChart } from '@superset-ui/core';
import SankeyChartPlugin from '@superset-ui/legacy-plugin-chart-sankey';
import { withResizableChartDemo } from '../../../shared/components/ResizableChartDemo';
import data from './data';

new SankeyChartPlugin().configure({ key: 'sankey' }).register();

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-sankey',
  decorators: [withResizableChartDemo],
};

export const basic = ({ width, height }) => (
  <SuperChart
    chartType="sankey"
    width={width}
    height={height}
    queriesData={[{ data }]}
    formData={{
      colorScheme: 'd3Category10',
    }}
  />
);
