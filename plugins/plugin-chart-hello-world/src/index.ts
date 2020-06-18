// eslint-disable-next-line import/prefer-default-export
export { default as HelloWorldChartPlugin } from './plugin';
/**
 * Note: this file exports the default export from HelloWorld.tsx.
 * If you want to export multiple visualization modules, you will need to
 * either add additional plugin folders (similar in structure to ./plugin)
 * OR export multiple instances of `ChartPlugin` extensions in ./plugin/index.ts
 * which in turn load exports from HelloWorld.tsx
 */
