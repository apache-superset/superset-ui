## @superset-ui/plugin-chart-observable

[![Version](https://img.shields.io/npm/v/@superset-ui/plugin-chart-observable.svg?style=flat-square)](https://img.shields.io/npm/v/@superset-ui/plugin-chart-observable.svg?style=flat-square)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui-plugins.svg?path=packages%2Fsuperset-ui-plugin-chart-observable&style=flat-square)](https://david-dm.org/apache-superset/superset-ui-plugins?path=packages/superset-ui-plugin-chart-observable)

This plugin provides Word Cloud for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to
lookup this chart throughout the app.

```js
import ObservableChartPlugin from '@superset-ui/legacy-plugin-chart-observable';

new ObservableChartPlugin().configure({ key: 'observable' }).register();
```

Then use it via `SuperChart`. See
[storybook](https://apache-superset.github.io/superset-ui-plugins/?selectedKind=plugin-chart-observable)
for more details.

```js
<SuperChart
  chartType="observable"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```
