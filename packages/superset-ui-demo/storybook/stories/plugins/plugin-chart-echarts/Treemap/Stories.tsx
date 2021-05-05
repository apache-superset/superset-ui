import React from 'react';
import { SuperChart, getChartTransformPropsRegistry } from '@superset-ui/core';
import { number, boolean, withKnobs, select } from '@storybook/addon-knobs';
import { EchartsTreemapChartPlugin } from '@superset-ui/plugin-chart-echarts';
import transformProps from '@superset-ui/plugin-chart-echarts/lib/Treemap/transformProps';
import data from './data';
import { withResizableChartDemo } from '../../../../shared/components/ResizableChartDemo';

new EchartsTreemapChartPlugin().configure({ key: 'echarts-treemap' }).register();

getChartTransformPropsRegistry().registerValue('echarts-treemap', transformProps);

export default {
  title: 'Chart Plugins|plugin-chart-echarts/Treemap',
  decorators: [withKnobs, withResizableChartDemo],
};

export const Treemap = ({ width, height }) => {
  return (
    <SuperChart
      chartType="echarts-treemap"
      width={width}
      height={height}
      queriesData={[{ data }]}
      formData={{
        colorScheme: 'supersetColors',
        groupby: ['gender', 'name'],
        metrics: ['count', 'MIN(num_boys)'],
        showLabels: boolean('Show labels', true),
        showUpperLabels: boolean('Show upperLabels', true),
        showBreadcrumb: boolean('Show Breadcrumb', true),
        labelType: select('Treemap label type', ['key', 'value', 'key_value'], 'key_value'),
        treemapRatio: number('Ratio', 0.5 * (1 + Math.sqrt(5))),
        roam: select('Roam', [false, 'scale', 'move', true], true),
        nodeClick: select('Node Click', [false, 'zoomToNode'], 'zoomToNode'),
      }}
    />
  );
};
