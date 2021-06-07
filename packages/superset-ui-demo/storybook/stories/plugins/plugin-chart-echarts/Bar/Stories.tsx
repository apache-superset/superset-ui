import React from 'react';
import { SuperChart, getChartTransformPropsRegistry } from '@superset-ui/core';
import {
  D3_TIME_FORMAT_OPTIONS,
  D3_FORMAT_OPTIONS,
} from '@superset-ui/chart-controls/lib/utils/D3Formatting';
import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import { EchartsBarChartPlugin } from '@superset-ui/plugin-chart-echarts';
import transformProps from '@superset-ui/plugin-chart-echarts/lib/Bar/transformProps';
import { timeseriesdataSource, barDataSource } from './constants';
import { withResizableChartDemo } from '../../../../shared/components/ResizableChartDemo';

new EchartsBarChartPlugin().configure({ key: 'echarts_bar_miexed_timeseries' }).register();

getChartTransformPropsRegistry().registerValue('echarts_bar_miexed_timeseries', transformProps);

export default {
  title: 'Chart Plugins|plugin-chart-echarts/Bar',
  decorators: [withKnobs, withResizableChartDemo],
};

export const TimeseriesBar = ({ width, height }) => {
  return (
    <SuperChart
      chartType="echarts_bar_miexed_timeseries"
      width={width}
      height={height}
      queriesData={[{ data: timeseriesdataSource }]}
      formData={{
        timeseries: true,
        colorScheme: 'supersetColors',
        groupby: ['country_name', 'country_code'],
        metrics: [
          {
            expressionType: 'SIMPLE',
            column: {
              column_name: 'SP_POP_1564_TO',
            },
            aggregate: 'SUM',
            label: 'SUM(SP_POP_1564_TO)',
          },
          'sum__SP_POP_TOTL',
          'sum__SP_RUR_TOTL',
        ],
        showLegend: boolean('Show legend', true),
        x_axis_time_format: select(
          'X AXIS FORMAT',
          D3_TIME_FORMAT_OPTIONS.map(item => item[0]),
          D3_TIME_FORMAT_OPTIONS[0][0],
        ),
        y_axis_format: select(
          'Y AXIS FORMAT',
          D3_FORMAT_OPTIONS.map(item => item[0]),
          D3_FORMAT_OPTIONS[0][0],
        ),
      }}
    />
  );
};

export const Bar = ({ width, height }) => {
  return (
    <SuperChart
      chartType="echarts_bar_miexed_timeseries"
      width={width}
      height={height}
      queriesData={[{ data: barDataSource }]}
      formData={{
        timeseries: false,
        colorScheme: 'supersetColors',
        groupby: ['country_name', 'country_code'],
        metrics: [
          {
            expressionType: 'SIMPLE',
            column: {
              column_name: 'SP_POP_1564_TO',
            },
            aggregate: 'SUM',
            label: 'SUM(SP_POP_1564_TO)',
          },
          'sum__SP_POP_TOTL',
          'sum__SP_RUR_TOTL',
        ],
        showLegend: boolean('Show legend', true),
        y_axis_format: select(
          'Y AXIS FORMAT',
          D3_FORMAT_OPTIONS.map(item => item[0]),
          D3_FORMAT_OPTIONS[0][0],
        ),
      }}
    />
  );
};
