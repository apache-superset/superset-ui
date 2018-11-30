import { isDefined } from '@superset-ui/core';
import { SupersetClient } from '@superset-ui/connection';
import getChartBuildQueryRegistry from '../registries/ChartBuildQueryRegistrySingleton';

export default class ChartClient {
  constructor({ client = SupersetClient }) {
    this.client = client;
  }

  loadFormData({ sliceId, formData }, options) {
    /* If sliceId is provided, use it to fetch stored formData from API */
    if (sliceId) {
      const promise = this.client.get({
        endpoint: `/superset/slice_json/${sliceId}`,
        ...options,
      });

      /*
       * If formData is also specified, override API result
       * with user-specified formData
       */
      return formData
        ? promise.then(dbFormData => ({
            ...dbFormData,
            formData,
          }))
        : promise;
    }

    /* If sliceId is not provided, returned formData wrapped in a Promise */
    return formData
      ? Promise.resolve(formData)
      : Promise.reject(new Error('At least one of sliceId or formData must be specified'));
  }

  loadQueryData(formData, options) {
    const buildQuery = getChartBuildQueryRegistry().get(formData.viz_type);
    if (buildQuery) {
      return this.client.post({
        endpoint: '/api/v1/query',
        postPayload: { query_context: buildQuery(formData) },
        ...options,
      });
    }

    return Promise.reject(new Error(`Unknown chart type: ${formData.viz_type}`));
  }

  loadDatasource(datasourceKey, options) {
    return this.client.get({
      endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`,
      ...options,
    });
  }

  loadAnnotation(annotationLayer) {
    /* When annotation does not require query */
    if (!isDefined(annotationLayer.sourceType)) {
      return Promise.resolve();
    }

    // TODO: Implement
    return Promise.reject(new Error('This feature is not implemented yet.'));
  }

  loadAnnotations(annotationLayers) {
    if (Array.isArray(annotationLayers) && annotationLayers.length > 0) {
      return Promise.all(annotationLayers.map(layer => this.loadAnnotation(layer))).then(results =>
        annotationLayers.reduce((prev, layer, i) => {
          const output = prev;
          output[layer.name] = results[i];

          return output;
        }, {}),
      );
    }

    return Promise.resolve({});
  }

  loadChartData({ sliceId, formData }) {
    return this.loadFormData({ formData, sliceId }).then(finalFormData =>
      Promise.all([
        this.loadQueryData(finalFormData),
        this.loadAnnotations(finalFormData.annotation_layers),
        this.loadDatasource(finalFormData.datasource),
      ]).then(([queryData, datasource, annotationData]) => ({
        annotationData,
        datasource,
        queryData,
      })),
    );
  }
}
