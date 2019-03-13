## @superset-ui/chart

[![Version](https://img.shields.io/npm/v/@superset-ui/chart.svg?style=flat)](https://img.shields.io/npm/v/@superset-ui/chart.svg?style=flat)
[![David (path)](https://img.shields.io/david/apache-superset/superset-ui.svg?path=packages%2Fsuperset-ui-chart&style=flat-square)](https://david-dm.org/apache-superset/superset-ui?path=packages/superset-ui-chart)

Description

#### Example usage

##### `<SuperChart />`

Coming

##### `<DataProvider />`

1. Configure `CORS` (CROSS ORIGIN RESOURCE SHARING) in your `Apache Superset` instance.

   a. Enable `CORS` requests to the following endpoints

   ```python
   # config.py
   ENABLE_CORS = True
   CORS_OPTIONS = {
       'supports_credentials': True,
       'allow_headers': [
           'X-CSRFToken', 'Content-Type', 'Origin', 'X-Requested-With', 'Accept',
       ],
       'resources': ['/superset/explore_json/*', '/superset/csrf_token/'],
       'origins': ['http://myappdomain:9001'],
   }
   ```

   b. Enable `CORS` requests from the relevant domains (i.e., the app in which you will embed
   charts)

2. Configure `SupersetClient` in the app where you will embed your charts. You can test this
   configuration in the `@superset-ui` storybook.

3. Register the needeed `@superset-ui` chart + color plugins.

4. Pass `SupersetClient` to the `DataProvider` along with the formData for the desired visualization
   type.

```javascript
import { DataProvider } from '@superset-ui/chart';
import { SupersetClient } from '@superset-ui/connection';
import ChartPlugin from '@superset-ui/plugin-chart-chartname';

// initialize Superset
SupersetClient.configure({
  credentials: 'include',
  host,
  mode: 'cors',
}).init();

// Register visualization plugin
new ChartPlugin().configure({ key: CHART_TYPE }).register();

// Fetch data and render the Chart
const render = () => (
  <DataProvider client={client} formData={formData}>
    {({ loading, error, payload }) => (
      <>
        {loading && <Loader />}

        {error && <RenderError error={error} />}

        {payload && (
          <SuperChart type={CHART_TYPE} chartProps={{ formData, payload, width, height }} />
        )}
      </>
    )}
  </DataProvider>
);
```

### Development

`@data-ui/build-config` is used to manage the build configuration for this package including babel
builds, jest testing, eslint, and prettier.
