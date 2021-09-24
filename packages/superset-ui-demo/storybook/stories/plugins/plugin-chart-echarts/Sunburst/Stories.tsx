import React from 'react';
import { SuperChart, getChartTransformPropsRegistry } from '@superset-ui/core';
import { boolean, number, select, withKnobs } from '@storybook/addon-knobs';
import { EchartsSunburstChartPlugin } from '@superset-ui/plugin-chart-echarts';
import transformProps from '@superset-ui/plugin-chart-echarts/lib/Sunburst/transformProps';
import { vaccineData } from './data';
import { withResizableChartDemo } from '../../../../shared/components/ResizableChartDemo';

new EchartsSunburstChartPlugin().configure({ key: 'echarts-sunburst' }).register();

getChartTransformPropsRegistry().registerValue('echarts-sunburst', transformProps);

export default {
  title: 'Chart Plugins|plugin-chart-echarts/Sunburst',
  decorators: [withKnobs, withResizableChartDemo],
};

export const VaccineSunburst = ({ width, height }) => {
  return (
    <SuperChart
      chartType="echarts-sunburst"
      width={width}
      height={height}
      queriesData={[{ data: vaccineData }]}
      formData={{
        groupby: ['product_category', 'clinical_stage', 'country_name'],
        metric: 'count',
        innerRadius: number('Inner Radius', 0),
        outerRadius: number('Outer Radius', 400),
        showLabel: boolean('Show labels', true),
        labelType: select('Pie label type', ['key', 'value', 'key_value'], 'key'),
        rotateLabel: select('Rotate label', ['radial', 'tangential'], 'radial'),
        labelPosition: select('Label position', ['inside', 'outside'], 'inside'),
      }}
    />
  );
};
