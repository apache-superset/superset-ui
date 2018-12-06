import { isDefined } from '@superset-ui/core';
import { SupersetClient, RequestConfig } from '@superset-ui/connection';
import getChartBuildQueryRegistry from '../registries/ChartBuildQueryRegistrySingleton';
import { FormData, AnnotationLayerMetadata } from '../query';

interface SliceIdAndOrFormData {
  sliceId?: number;
  formData: FormData;
}

interface AnnotationData {
  [key: string]: object;
}

interface ChartData {
  annotationData: AnnotationData;
  datasource: object;
  queryData: object;
}

export default class ChartClient {
  client: SupersetClient;

  constructor({ client = SupersetClient } = {}) {
    this.client = client;
  }

  loadFormData(input: SliceIdAndOrFormData, options?: RequestConfig): Promise<FormData> {
    /* If sliceId is provided, use it to fetch stored formData from API */
    if (input.sliceId) {
      const promise = this.client.get({
        endpoint: `/superset/slice_json/${input.sliceId}`,
        ...options,
      });

      /*
       * If formData is also specified, override API result
       * with user-specified formData
       */
      return input.formData
        ? promise.then((dbFormData: object) => ({
            ...dbFormData,
            ...input.formData,
          }))
        : promise;
    }

    /* If sliceId is not provided, returned formData wrapped in a Promise */
    return input.formData
      ? Promise.resolve(input.formData)
      : Promise.reject(new Error('At least one of sliceId or formData must be specified'));
  }

  loadQueryData(formData: FormData, options?: RequestConfig) {
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

  loadDatasource(datasourceKey: string, options?: RequestConfig) {
    return this.client.get({
      endpoint: `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`,
      ...options,
    });
  }

  loadAnnotation(annotationLayer: AnnotationLayerMetadata): Promise<object> {
    /* When annotation does not require query */
    if (!isDefined(annotationLayer.sourceType)) {
      return Promise.resolve({});
    }

    // TODO: Implement
    return Promise.reject(new Error('This feature is not implemented yet.'));
  }

  loadAnnotations(annotationLayers?: Array<AnnotationLayerMetadata>): Promise<AnnotationData> {
    if (Array.isArray(annotationLayers) && annotationLayers.length > 0) {
      return Promise.all(annotationLayers.map(layer => this.loadAnnotation(layer))).then(results =>
        annotationLayers.reduce((prev, layer, i) => {
          const output: AnnotationData = prev;
          output[layer.name] = results[i];

          return output;
        }, {}),
      );
    }

    return Promise.resolve({});
  }

  loadChartData(input: SliceIdAndOrFormData): Promise<ChartData> {
    return this.loadFormData(input).then(finalFormData =>
      Promise.all([
        this.loadAnnotations(finalFormData.annotation_layers),
        this.loadDatasource(finalFormData.datasource),
        this.loadQueryData(finalFormData),
      ]).then(([annotationData, datasource, queryData]) => ({
        annotationData,
        datasource,
        queryData,
      })),
    );
  }
}
