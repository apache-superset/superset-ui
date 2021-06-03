import React from 'react';
import { SuperChart, getChartTransformPropsRegistry } from '@superset-ui/core';
import { boolean, withKnobs, select } from '@storybook/addon-knobs';
import { EchartsWaterfallChartPlugin } from '@superset-ui/plugin-chart-echarts';
import transformProps from '@superset-ui/plugin-chart-echarts/src/Waterfall/transformProps';
import data from './data';
import { withResizableChartDemo } from '../../../../shared/components/ResizableChartDemo';

new EchartsWaterfallChartPlugin().configure({ key: 'echarts-waterfall' }).register();

getChartTransformPropsRegistry().registerValue('echarts-waterfall', transformProps);

export default {
  title: 'Chart Plugins|plugin-chart-echarts/Waterfall',
  decorators: [withKnobs, withResizableChartDemo],
};

export const Waterfall = ({ width, height }) => {
  return (
    <SuperChart
      chartType="echarts-waterfall"
      width={width}
      height={height}
      queriesData={[{ data }]}
      formData={{
        metric: `SUM(decomp_volume)`,
        xAxisColumn: 'due_to_group',
        periodColumn: 'period',
        x_ticks_layout: '45°',
        adhocFilters: [
          {
            clause: 'WHERE',
            comparator: '0',
            expressionType: 'SIMPLE',
            filterOptionName: 'filter_8ix98su8zu4_t4767ixmbp9',
            isExtra: false,
            isNew: false,
            operator: '!=',
            sqlExpression: null,
            subject: 'period',
          },
        ],
      }}
    />
  );
};
