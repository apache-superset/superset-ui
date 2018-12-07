import { ChartClient } from '../../src';
import { SupersetClientClass } from '../../../superset-ui-connection/lib';

describe('ChartClient', () => {
  it('exists', () => {
    expect(ChartClient).toBeDefined();
  });

  describe('new ChartClient(config)', () => {
    it('creates a client without argument', () => {
      const chartClient = new ChartClient();
      expect(chartClient).toBeInstanceOf(ChartClient);
    });
    it('creates a client with specified config.client', () => {
      const customClient = new SupersetClientClass();
      const chartClient = new ChartClient({ client: customClient });
      expect(chartClient).toBeInstanceOf(ChartClient);
      expect(chartClient.client).toBe(customClient);
    });
  });
  describe('.loadFormData({ sliceId, formData }, options)', () => {});
  describe('.loadQueryData(formData, options)', () => {});
  describe('.loadDatasource(datasourceKey, options)', () => {});
  describe('.loadAnnotation(annotationLayer)', () => {});
  describe('.loadAnnotations(annotationLayers)', () => {});
  describe('.loadChartData({ sliceId, formData })', () => {});
});
