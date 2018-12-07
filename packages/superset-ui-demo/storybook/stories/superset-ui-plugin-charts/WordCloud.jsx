import React from 'react';

import WordCloudChartPlugin from '@superset-ui/plugin-chart-word-cloud/lib';
import { SupersetClient } from '@superset-ui/connection';
import ChartClient from '@superset-ui/chart/lib/clients/ChartClient';
//import SuperChart from '@superset-ui/chart/lib/components/SuperChart';

SupersetClient.configure({
  host: 'localhost:8080',
  mode: 'cors',
  csrfToken: '',
  credentials: 'include',
}).init();
new WordCloudChartPlugin().configure({ key: 'word_cloud' }).register();

class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      chart: undefined,
    };
  }

  componentDidMount() {
    const client = new ChartClient({ client: SupersetClient });
    client.loadChartData({ sliceId: 433 }).then(d => {
      console.log(d);
    });
  }

  render() {
    return <div />;
  }
}

export default [
  {
    renderStory: () => <Demo />,
    storyName: 'Embedding Word Cloud',
    storyPath: '@superset-ui/charts',
  },
];
