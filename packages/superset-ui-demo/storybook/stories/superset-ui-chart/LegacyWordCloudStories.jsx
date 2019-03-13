import React from 'react';

import { SuperChart, DataProvider, ChartProps } from '@superset-ui/chart';
import { SupersetClient } from '@superset-ui/connection';
import WordCloudLegacyPlugin from '@superset-ui/legacy-plugin-chart-word-cloud';

import ConfigureCORS from '../superset-ui-connection/ConfigureCORS';
import { wordCloudFormData } from '../mocks/formData';

const CHART_TYPE = 'word-cloud-legacy';

new WordCloudLegacyPlugin().configure({ key: CHART_TYPE }).register();

export default [
  {
    renderStory: () => <ConfigureCORS verbose={false} />,
    storyName: 'Configuration',
    storyPath: '@superset-ui/chart',
  },
  {
    renderStory: () => (
      <div style={{ margin: 16 }}>
        <DataProvider client={SupersetClient} formData={wordCloudFormData}>
          {({ loading, payload, error }) => {
            if (loading) return <div>Loading!</div>;

            if (error) {
              // @TODO own component
              return (
                <div>
                  The following error occurred, make sure you have Configured CORS in Superset and
                  tested authentication in the `Configuration` story above.
                  <br />
                  <br />
                  <div className="alert alert-danger">
                    {error.stack || error.message}
                    {!error.message &&
                      !error.stack &&
                      (typeof error === 'object' ? JSON.stringify(error) : String(error))}
                  </div>
                </div>
              );
            }

            if (payload)
              return (
                <>
                  <SuperChart
                    chartType={CHART_TYPE}
                    chartProps={
                      new ChartProps({
                        formData: wordCloudFormData,
                        height: 500,
                        payload,
                        width: 700,
                      })
                    }
                  />
                  <div style={{ fontSize: 10 }}>
                    Data <pre>{JSON.stringify(payload, null, 2)}</pre>
                  </div>
                </>
              );

            return null;
          }}
        </DataProvider>
      </div>
    ),
    storyName: 'DataProvider',
    storyPath: '@superset-ui/chart',
  },
];
