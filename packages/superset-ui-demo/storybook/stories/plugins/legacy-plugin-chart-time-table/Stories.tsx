/* eslint-disable no-magic-numbers, sort-keys */
import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import TimeTableChartPlugin from '@superset-ui/legacy-plugin-chart-time-table';
import data from './data';

new TimeTableChartPlugin().configure({ key: 'time-table' }).register();

export default {
  title: 'Legacy Chart Plugins|legacy-plugin-chart-treemap',
};

export const basic = () => (
  <SuperChart chartType="time-table" width={400} height={400} queryData={{ data }} formData={{}} />
);
