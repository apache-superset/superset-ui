## @superset-ui/plugin-chart-hello-world



This plugin provides Hello World for Superset.

### Usage

Configure `key`, which can be any `string`, and register the plugin. This `key` will be used to lookup this chart throughout the app.

```js
import HelloWorldChartPlugin from '@superset-ui/plugin-chart-hello-world';

new HelloWorldChartPlugin()
  .configure({ key: 'hello-world' })
  .register();
```

Then use it via `SuperChart`. See [storybook](https://apache-superset.github.io/superset-ui/?selectedKind=plugin-chart-hello-world) for more details.

```js
<SuperChart
  chartType="hello-world"
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
├── README.md
├── package.json
├── src
│   ├── HelloWorld.tsx
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