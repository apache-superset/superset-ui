## @superset-ui/plugin-chart-plugin-filter-select

[![Version](https://img.shields.io/npm/v/@superset-ui/plugin-chart-plugin-filter-select.svg?style=flat-square)](https://www.npmjs.com/package/@superset-ui/plugin-chart-plugin-filter-select)

This plugin provides Plugin Filter Select for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import PluginFilterSelectChartPlugin from '@superset-ui/plugin-chart-plugin-filter-select';

new PluginFilterSelectChartPlugin()
  .configure({ key: 'plugin-filter-select' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-plugin-filter-select) for more details.

```js
<SuperChart
  chartType="plugin-filter-select"
  width={600}
  height={600}
  formData={...}
  queryData={{
    data: {...},
  }}
/>
```

### File structure generated

```
├── package.json
├── README.md
├── tsconfig.json
├── src
│   ├── PluginFilterSelect.tsx
│   ├── images
│   │   └── thumbnail.png
│   ├── index.ts
│   ├── plugin
│   │   ├── buildQuery.ts
│   │   ├── controlPanel.ts
│   │   ├── index.ts
│   │   └── transformProps.ts
│   └── types.ts
├── test
│   └── index.test.ts
└── types
    └── external.d.ts
```