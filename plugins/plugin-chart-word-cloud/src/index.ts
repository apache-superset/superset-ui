import configureEncodable from './configureEncodable';

configureEncodable();

export { default as WordCloudChartPlugin } from './plugin';
export { default as LegacyWordCloudChartPlugin } from './legacyPlugin';
export * from './types';
