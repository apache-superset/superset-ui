import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import ChordChartPlugin from '../../../../../../plugins/legacy-plugin-chart-chord';
import data from './data';

new ChordChartPlugin().configure({ key: 'chord' }).register();

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-chord',
};

export const basic = () => (
  <SuperChart
    chartType="chord"
    width={400}
    height={400}
    queryData={{ data }}
    formData={{
      colorScheme: 'd3Category10',
      yAxisFormat: '.2f',
    }}
  />
);
