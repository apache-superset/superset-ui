import React from 'react';

import { getCategoricalSchemeRegistry } from '@superset-ui/color/lib';
import AirbnbPalettes from '@superset-ui/color/lib/colorSchemes/categorical/airbnb';
import WordCloudChartPlugin from '@superset-ui/plugin-chart-word-cloud/lib';
import { SupersetClient } from '@superset-ui/connection';
import { ChartClient, ChartProps } from '@superset-ui/chart/lib';
import SuperChart from '@superset-ui/chart/lib/components/SuperChart';

SupersetClient.configure({
  host: 'localhost:8080',
  mode: 'cors',
  csrfToken: '',
  credentials: 'include',
  headers: new Headers({
    'X-CSRF-Token': '',
  }),
}).init();
new WordCloudChartPlugin().configure({ key: 'word_cloud' }).register();

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chartProps: undefined,
    };
  }

  componentDidMount() {
    getCategoricalSchemeRegistry()
      .registerValue('bnbColors', AirbnbPalettes)
      .setDefaultKey('bnbColors');
    const client = new ChartClient({ client: SupersetClient });
    client.loadChartData({ sliceId: 433 }).then(({ queryData, formData }) => {
      const payload = queryData.json[0];
      const chartProps = new ChartProps({
        payload,
        formData: {
          colorScheme: 'bnbColors',
          ...formData,
        },
        width: 600,
        height: 400,
      });
      this.setState({ chartProps });
    });
  }

  render() {
    if (this.state.chartProps) {
      return <SuperChart chartType="word_cloud" chartProps={this.state.chartProps} />;
    } else {
      return <div>embedding a word cloud viz</div>;
    }
  }
}

export default [
  {
    renderStory: () => <Demo />,
    storyName: 'Embedding Word Cloud',
    storyPath: '@superset-ui/charts',
  },
];
