import React from 'react';
import { SuperChart } from '@superset-ui/chart';
import {
  maps,
  ChoroplethMapChartPlugin,
} from '../../../../../../plugins/plugin-chart-choropleth-map/src';
import { withKnobs, select } from '@storybook/addon-knobs';
import MapDataProvider from './MapDataProvider';

new ChoroplethMapChartPlugin().configure({ key: 'choropleth-map' }).register();

export default {
  title: 'Chart Plugins|plugin-chart-choropleth-map',
  decorators: [withKnobs],
};

export const worldMap = () => {
  const map = select(
    'Map',
    maps.map(m => m.key),
    'world',
    'map',
  );

  return (
    <MapDataProvider map={map}>
      {({ data }) => (
        <SuperChart
          chartType="choropleth-map"
          width={800}
          height={450}
          queryData={{ data }}
          formData={{
            map,
            encoding: {
              key: {
                field: 'key',
              },
              fill: {
                type: 'quantitative',
                field: 'numStudents',
                scale: {
                  range: ['#cecee5', '#3f007d'],
                },
              },
            },
          }}
        />
      )}
    </MapDataProvider>
  );
};

export const usa = () => (
  <MapDataProvider map="usa">
    {({ data }) => (
      <SuperChart
        chartType="choropleth-map"
        width={800}
        height={450}
        queryData={{ data }}
        formData={{
          map: 'usa',
          encoding: {
            key: {
              field: 'key',
            },
            fill: {
              type: 'quantitative',
              field: 'numStudents',
              scale: {
                range: ['#fdc28c', '#7f2704'],
              },
            },
          },
        }}
      />
    )}
  </MapDataProvider>
);

export const categoricalColor = () => (
  <MapDataProvider map="usa">
    {({ data }) => (
      <SuperChart
        chartType="choropleth-map"
        width={800}
        height={450}
        queryData={{ data }}
        formData={{
          map: 'usa',
          encoding: {
            fill: {
              type: 'nominal',
              field: 'favoriteFruit',
              scale: {
                domain: ['apple', 'banana', 'grape'],
                range: ['#e74c3c', '#f1c40f', '#9b59b6'],
              },
            },
          },
        }}
      />
    )}
  </MapDataProvider>
);
