import ChartClient from '../../src/clients/ChartClient';

describe('ChartClient', () => {
  it('exists', () => {
    expect(ChartClient).toBeDefined();
  });

  describe('new ChartClient(config)', () => {
    it('creates a client without argument', () => {});
    it('creates a client with specified config.client', () => {});
  });
  describe('.loadFormData({ sliceId, formData }, options)', () => {});
  describe('.loadQueryData(formData, options)', () => {});
  describe('.loadDatasource(datasourceKey, options)', () => {});
  describe('.loadAnnotation(annotationLayer)', () => {});
  describe('.loadAnnotations(annotationLayers)', () => {});
  describe('.loadChartData({ sliceId, formData })', () => {});
});
