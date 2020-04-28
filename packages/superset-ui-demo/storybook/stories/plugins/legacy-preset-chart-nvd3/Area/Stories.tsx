import { AreaChartPlugin } from '@superset-ui/legacy-preset-chart-nvd3';

new AreaChartPlugin().configure({ key: 'area' }).register();

export default {
  title: 'Legacy Chart Plugins|legacy-preset-chart-nvd3/Area',
};

export { default as stacked } from './stories/stacked';

// export default [
//   {
//     renderStory: ,
//     storyName: 'Stacked',
//     storyPath: 'legacy-|preset-chart-nvd3|AreaChartPlugin',
//   },
//   {
//     renderStory: () => (
//       <SuperChart
//         chartType="area"
//         datasource={dummyDatasource}
//         width={400}
//         height={400}
//         queryData={{ data }}
//         formData={{
//           bottomMargin: 'auto',
//           colorCcheme: 'd3Category10',
//           contribution: false,
//           groupby: ['region'],
//           lineInterpolation: 'linear',
//           metrics: ['sum__SP_POP_TOTL'],
//           richTooltip: true,
//           showBrush: 'auto',
//           showControls: false,
//           showLegend: true,
//           stackedStyle: 'stack',
//           vizType: 'area',
//           xAxisFormat: '%Y',
//           xAxisLabel: '',
//           xAxisShowminmax: false,
//           xTicksLayout: 'auto',
//           yAxisBounds: [0, 3000000000],
//           yAxisFormat: '.3s',
//           yLogScale: false,
//         }}
//       />
//     ),
//     storyName: 'Stacked with yAxisBounds',
//     storyPath: 'legacy-|preset-chart-nvd3|AreaChartPlugin',
//   },
//   {
//     renderStory: () => (
//       <SuperChart
//         chartType="area"
//         datasource={dummyDatasource}
//         width={400}
//         height={400}
//         queryData={{ data }}
//         formData={{
//           bottomMargin: 'auto',
//           colorCcheme: 'd3Category10',
//           contribution: false,
//           groupby: ['region'],
//           lineInterpolation: 'linear',
//           metrics: ['sum__SP_POP_TOTL'],
//           richTooltip: true,
//           showBrush: 'auto',
//           showControls: true,
//           showLegend: true,
//           stackedStyle: 'stack',
//           vizType: 'area',
//           xAxisFormat: '%Y',
//           xAxisLabel: '',
//           xAxisShowminmax: false,
//           xTicksLayout: 'auto',
//           yAxisBounds: [1000000000, null],
//           yAxisFormat: '.3s',
//           yLogScale: false,
//         }}
//       />
//     ),
//     storyName: 'Stacked with yAxisBounds min only',
//     storyPath: 'legacy-|preset-chart-nvd3|AreaChartPlugin',
//   },
//   {
//     renderStory: () => (
//       <SuperChart
//         chartType="area"
//         datasource={dummyDatasource}
//         width={400}
//         height={400}
//         queryData={{ data }}
//         formData={{
//           bottomMargin: 'auto',
//           colorCcheme: 'd3Category10',
//           contribution: false,
//           groupby: ['region'],
//           lineInterpolation: 'linear',
//           metrics: ['sum__SP_POP_TOTL'],
//           richTooltip: true,
//           showBrush: 'auto',
//           showControls: false,
//           showLegend: true,
//           stackedStyle: 'expand',
//           vizType: 'area',
//           xAxisFormat: '%Y',
//           xAxisLabel: '',
//           xAxisShowminmax: false,
//           xTicksLayout: 'auto',
//           yAxisBounds: [null, null],
//           yAxisFormat: '.3s',
//           yLogScale: false,
//         }}
//       />
//     ),
//     storyName: 'Expanded',
//     storyPath: 'legacy-|preset-chart-nvd3|AreaChartPlugin',
//   },
//   {
//     renderStory: () => (
//       <SuperChart
//         chartType="area"
//         datasource={dummyDatasource}
//         width={400}
//         height={400}
//         queryData={{ data }}
//         formData={{
//           bottomMargin: 'auto',
//           colorCcheme: 'd3Category10',
//           contribution: false,
//           groupby: ['region'],
//           lineInterpolation: 'linear',
//           metrics: ['sum__SP_POP_TOTL'],
//           richTooltip: true,
//           showBrush: 'auto',
//           showControls: true,
//           showLegend: true,
//           stackedStyle: 'stack',
//           vizType: 'area',
//           xAxisFormat: '%Y',
//           xAxisLabel: '',
//           xAxisShowminmax: false,
//           xTicksLayout: 'auto',
//           yAxisBounds: [null, null],
//           yAxisFormat: '.3s',
//           yLogScale: false,
//         }}
//       />
//     ),
//     storyName: 'Controls Shown',
//     storyPath: 'legacy-|preset-chart-nvd3|AreaChartPlugin',
//   },
// ];
