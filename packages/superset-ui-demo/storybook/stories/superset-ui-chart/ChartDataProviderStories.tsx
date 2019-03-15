import React from 'react';

import { SuperChart, ChartDataProvider, ChartProps } from '@superset-ui/chart';
import { SupersetClient } from '@superset-ui/connection';
import WordCloudLegacyPlugin from '@superset-ui/legacy-plugin-chart-word-cloud';
import WordCloudPlugin from '@superset-ui/plugin-chart-word-cloud';
import { BigNumberChartPlugin } from '@superset-ui/legacy-preset-chart-big-number';
import { text, select } from '@storybook/addon-knobs';
import { DataProviderProvidedProps } from '../../../../superset-ui-chart/src';

import { wordCloudFormData, bigNumberFormData } from '../mocks/formData';

import Expandable from '../../shared/components/Expandable';
import VerifyCORS, { renderError } from '../../shared/components/VerifyCORS';

const WORD_CLOUD_LEGACY = wordCloudFormData.viz_type;
const WORD_CLOUD = 'word_cloud_new';
const BIG_NUMBER = bigNumberFormData.viz_type;

new WordCloudLegacyPlugin().configure({ key: WORD_CLOUD_LEGACY }).register();
new WordCloudPlugin().configure({ key: WORD_CLOUD }).register();
new BigNumberChartPlugin().configure({ key: BIG_NUMBER }).register();

const VIS_TYPES = [BIG_NUMBER, WORD_CLOUD, WORD_CLOUD_LEGACY];
const FORM_DATA_LOOKUP = {
  [BIG_NUMBER]: bigNumberFormData,
  [WORD_CLOUD]: { ...wordCloudFormData, viz_type: WORD_CLOUD },
  [WORD_CLOUD_LEGACY]: wordCloudFormData,
};

export default [
  {
    renderStory: () => {
      const host = text('Set Superset App host for CORS request', 'localhost:9000');
      const visType = select('Chart Plugin Type', VIS_TYPES, VIS_TYPES[0]);
      const formData = text('Override formData', JSON.stringify(FORM_DATA_LOOKUP[visType]));
      const width = text('Vis width', '500');
      const height = text('Vis height', '300');

      return (
        <div style={{ margin: 16 }}>
          <VerifyCORS host={host}>
            {() => (
              <ChartDataProvider client={SupersetClient} formData={JSON.parse(formData)}>
                {({ loading, payload, error }: DataProviderProvidedProps) => {
                  if (loading) return <div>Loading!</div>;

                  if (error) return renderError(error);

                  if (payload)
                    return (
                      <>
                        <SuperChart
                          chartType={visType}
                          chartProps={
                            new ChartProps({
                              formData: payload.formData,
                              height: Number(height),
                              // @TODO fix typing
                              // all vis's now expect objects but api/v1/ returns an array
                              payload: Array.isArray(payload.queryData)
                                ? payload.queryData[0]
                                : payload.queryData,
                              width: Number(width),
                            })
                          }
                        />
                        <br />
                        <Expandable expandableWhat="payload">
                          <pre style={{ fontSize: 11 }}>{JSON.stringify(payload, null, 2)}</pre>
                        </Expandable>
                      </>
                    );

                  return null;
                }}
              </ChartDataProvider>
            )}
          </VerifyCORS>
        </div>
      );
    },
    storyName: 'ChartDataProvider',
    storyPath: '@superset-ui/chart',
  },
];
