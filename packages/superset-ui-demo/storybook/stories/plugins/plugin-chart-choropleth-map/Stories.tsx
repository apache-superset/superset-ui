import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import {
  maps,
  ChoroplethMapChartPlugin,
} from '../../../../../../plugins/plugin-chart-choropleth-map/src';
import { withKnobs, select } from '@storybook/addon-knobs';
import data from './Stories';

new ChoroplethMapChartPlugin().configure({ key: 'choropleth-map' }).register();

export default {
  title: 'Chart Plugins|plugin-chart-choropleth-map',
  decorators: [withKnobs],
};

export const worldMap = () => (
  <SuperChart
    chartType="choropleth-map"
    width={800}
    height={450}
    queryData={{ data }}
    formData={{
      map: 'world',
      linearColorScheme: 'schemeRdYlBu',
      numberFormat: '.3s',
      selectCountry: select(
        'Map',
        maps.map(m => m.key),
        'world',
        'map',
      ),
    }}
  />
);

export const usa = () => (
  <SuperChart
    chartType="choropleth-map"
    width={800}
    height={450}
    queryData={{ data }}
    formData={{
      map: 'usa',
    }}
  />
);
