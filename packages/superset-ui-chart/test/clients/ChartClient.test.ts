import fetchMock from 'fetch-mock';
import { SupersetClientClass, SupersetClient } from '@superset-ui/connection';

import { ChartClient } from '../../src';
import { LOGIN_GLOB } from '../../../superset-ui-connection/test/fixtures/constants';

describe('ChartClient', () => {
  beforeAll(() => {
    fetchMock.get(LOGIN_GLOB, { csrf_token: '1234' });
    SupersetClient.reset();
    SupersetClient.configure().init();
  });

  afterAll(fetchMock.restore);

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
  describe('.loadFormData({ sliceId, formData }, options)', () => {
    it('loadFormData if given only sliceId', () => {
      const chartClient = new ChartClient();
      fetchMock.get('glob:*/api/v1/formData/?slice_id=123', {
        granularity: 'minute',
        field1: 'abc',
        field2: 'def',
      });

      return chartClient.loadFormData({ sliceId: 123 }).then(value => {
        expect(value).toEqual({
          granularity: 'minute',
          field1: 'abc',
          field2: 'def',
        });

        return value;
      });
    });
  });
  describe('.loadQueryData(formData, options)', () => {});
  describe('.loadDatasource(datasourceKey, options)', () => {});
  describe('.loadAnnotation(annotationLayer)', () => {});
  describe('.loadAnnotations(annotationLayers)', () => {});
  describe('.loadChartData({ sliceId, formData })', () => {});
});
