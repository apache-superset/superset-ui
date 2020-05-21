import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import {
  MAPS,
  ChoroplethMapChartPlugin,
} from '../../../../../../plugins/plugin-chart-choropleth-map/src';
import { withKnobs, select } from '@storybook/addon-knobs';
import data from './Stories';

new ChoroplethMapChartPlugin().configure({ key: 'choropleth-map' }).register();

export default {
  title: 'Chart Plugins|plugin-chart-choropleth-map',
  decorators: [withKnobs],
};

export const basic = () => (
  <SuperChart
    chartType="choropleth-map"
    width={400}
    height={400}
    queryData={{ data }}
    formData={{
      linearColorScheme: 'schemeRdYlBu',
      numberFormat: '.3s',
      selectCountry: select(
        'Map',
        MAPS.map(m => m.key),
        'france',
        'map',
      ),
    }}
  />
);
