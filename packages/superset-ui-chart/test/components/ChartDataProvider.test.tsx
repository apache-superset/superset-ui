import React from 'react';
import { shallow } from 'enzyme';
import ChartClient from '../../src/clients/ChartClient';
import ChartDataProvider, { Props } from '../../src/components/ChartDataProvider';
import { bigNumberFormData } from '../fixtures/formData';

const mockQueryPayload = [{ query: 'payload' }];
const defaultMockLoadFormData = jest.fn(allProps => Promise.resolve(allProps.formData));
let mockLoadFormData = defaultMockLoadFormData; // allows overriding in tests
const mockLoadDatasource = jest.fn(datasource => Promise.resolve(datasource));
const mockLoadQueryData = jest.fn(() => Promise.resolve(mockQueryPayload));

// ChartClient is now a mock
jest.mock('../../src/clients/ChartClient', () =>
  jest.fn().mockImplementation(() => ({
    loadDatasource: mockLoadDatasource,
    loadFormData: mockLoadFormData,
    loadQueryData: mockLoadQueryData,
  })),
);

const ChartClientMock = ChartClient as jest.Mock<ChartClient>;

describe('ChartDataProvider', () => {
  beforeEach(() => {
    ChartClientMock.mockClear();

    mockLoadFormData = defaultMockLoadFormData;
    mockLoadFormData.mockClear();
    mockLoadDatasource.mockClear();
    mockLoadQueryData.mockClear();
  });

  const props: Props = {
    formData: { ...bigNumberFormData },
    sliceId: 123,
    children: () => <div />,
  };

  function setup(overrideProps?: Partial<Props>) {
    return shallow(<ChartDataProvider {...props} {...overrideProps} />);
  }

  it('instantiates a new ChartClient()', () => {
    setup();
    expect(ChartClientMock).toHaveBeenCalledTimes(1);
  });

  describe('ChartClient.loadFormData', () => {
    it('calls method on mount', () => {
      setup();
      expect(mockLoadFormData.mock.calls).toHaveLength(1);
      expect(mockLoadFormData.mock.calls[0][0]).toEqual({
        sliceId: props.sliceId,
        formData: props.formData,
      });
    });

    it('should pass formDataRequestOptions to ChartClient.loadFormData', () => {
      const options = { host: 'override' };
      setup({ formDataRequestOptions: options });
      expect(mockLoadFormData.mock.calls).toHaveLength(1);
      expect(mockLoadFormData.mock.calls[0][1]).toEqual(options);
    });

    it('calls ChartClient.loadFormData when formData or sliceId change', () => {
      const wrapper = setup();
      const newProps = { sliceId: undefined, formData: { test: 'test' } };
      expect(mockLoadFormData.mock.calls).toHaveLength(1);

      wrapper.setProps(newProps);
      expect(mockLoadFormData.mock.calls).toHaveLength(2);
      expect(mockLoadFormData.mock.calls[1][0]).toEqual(newProps);
    });
  });

  describe('ChartClient.loadDatasource', () => {
    it('does not method if loadDatasource is false', done => {
      expect.assertions(1);
      setup({ loadDatasource: false });
      setTimeout(() => {
        expect(mockLoadDatasource.mock.calls).toHaveLength(0);
        done();
      }, 0);
    });

    it('calls method on mount if loadDatasource is true', done => {
      expect.assertions(2);
      setup({ loadDatasource: true });
      setTimeout(() => {
        expect(mockLoadDatasource.mock.calls).toHaveLength(1);
        expect(mockLoadDatasource.mock.calls[0][0]).toEqual(props.formData!.datasource);
        done();
      }, 0);
    });

    it('should pass datasourceRequestOptions to ChartClient.loadDatasource', done => {
      expect.assertions(2);
      const options = { host: 'override' };
      setup({ loadDatasource: true, datasourceRequestOptions: options });
      setTimeout(() => {
        expect(mockLoadDatasource.mock.calls).toHaveLength(1);
        expect(mockLoadDatasource.mock.calls[0][1]).toEqual(options);
        done();
      }, 0);
    });

    it('calls ChartClient.loadDatasource if loadDatasource is true and formData or sliceId change', done => {
      expect.assertions(3);
      const newDatasource = 'test';
      const wrapper = setup({ loadDatasource: true });
      wrapper.setProps({ formData: { datasource: newDatasource }, sliceId: undefined });

      setTimeout(() => {
        expect(mockLoadDatasource.mock.calls).toHaveLength(2);
        expect(mockLoadDatasource.mock.calls[0][0]).toEqual(props.formData!.datasource);
        expect(mockLoadDatasource.mock.calls[1][0]).toEqual(newDatasource);
        done();
      }, 0);
    });
  });

  describe('ChartClient.loadQueryData', () => {
    it('calls method on mount', done => {
      expect.assertions(2);
      setup();
      setTimeout(() => {
        expect(mockLoadQueryData.mock.calls).toHaveLength(1);
        // @ts-ignore unsure why mock.calls tuple length is "0"
        expect(mockLoadQueryData.mock.calls[0][0]).toEqual(props.formData);
        done();
      }, 0);
    });

    it('should pass queryDataRequestOptions to ChartClient.loadQueryData', done => {
      expect.assertions(2);
      const options = { host: 'override' };
      setup({ queryRequestOptions: options });
      setTimeout(() => {
        expect(mockLoadQueryData.mock.calls).toHaveLength(1);
        // @ts-ignore unsure why mock.calls tuple length is "0"
        expect(mockLoadQueryData.mock.calls[0][1]).toEqual(options);
        done();
      }, 0);
    });

    it('calls ChartClient.loadQueryData when formData or sliceId change', done => {
      expect.assertions(3);
      const newFormData = { key: 'test' };
      const wrapper = setup();
      wrapper.setProps({ formData: newFormData, sliceId: undefined });

      setTimeout(() => {
        expect(mockLoadQueryData.mock.calls).toHaveLength(2);
        // @ts-ignore unsure why mock.calls tuple length is "0"
        expect(mockLoadQueryData.mock.calls[0][0]).toEqual(props.formData);
        // @ts-ignore unsure why mock.calls tuple length is "0"
        expect(mockLoadQueryData.mock.calls[1][0]).toEqual(newFormData);
        done();
      }, 0);
    });
  });

  describe('children', () => {
    it('calls children({ loading: true }) when loading', () => {
      const children = jest.fn();
      setup({ children });

      // during the first tick (before more promises resolve) loading is true
      expect(children.mock.calls).toHaveLength(1);
      expect(children.mock.calls[0][0]).toEqual({ loading: true });
    });

    it('calls children({ payload }) when loaded', done => {
      expect.assertions(2);
      const children = jest.fn();
      setup({ children, loadDatasource: true });

      setTimeout(() => {
        expect(children.mock.calls).toHaveLength(2);
        // note: since we have mocked the ChartClient
        // the values here directly depend on how the mock fns are defined above
        expect(children.mock.calls[1][0]).toEqual({
          payload: {
            formData: props.formData,
            datasource: props.formData!.datasource,
            queryData: mockQueryPayload,
          },
        });
        done();
      }, 0);
    });

    it('calls children({ error }) upon error', done => {
      expect.assertions(2);
      const children = jest.fn();
      // @ts-ignore Type 'Mock<Promise<any>, []>' is not assignable to type 'Mock<Promise<any>, any[]>'
      mockLoadFormData = jest.fn(() => Promise.reject(Error('error')));

      setup({ children });

      setTimeout(() => {
        expect(children.mock.calls).toHaveLength(2); // loading + error
        expect(children.mock.calls[1][0]).toEqual({ error: Error('error') });
        done();
      }, 0);
    });
  });

  describe('callbacks', () => {
    it('calls onLoad(payload) when loaded', done => {
      expect.assertions(2);
      const onLoaded = jest.fn();
      setup({ onLoaded, loadDatasource: true });

      setTimeout(() => {
        expect(onLoaded.mock.calls).toHaveLength(1);
        // note: since we have mocked the ChartClient
        // the values here directly depend on how the mock fns are defined above
        expect(onLoaded.mock.calls[0][0]).toEqual({
          formData: props.formData,
          datasource: props.formData!.datasource,
          queryData: mockQueryPayload,
        });
        done();
      }, 0);
    });

    it('calls onError(error) upon error', done => {
      expect.assertions(2);
      const onError = jest.fn();
      // @ts-ignore Type 'Mock<Promise<any>, []>' is not assignable to type 'Mock<Promise<any>, any[]>'
      mockLoadFormData = jest.fn(() => Promise.reject(Error('error')));

      setup({ onError });
      setTimeout(() => {
        expect(onError.mock.calls).toHaveLength(1);
        expect(onError.mock.calls[0][0]).toEqual(Error('error'));
        done();
      }, 0);
    });
  });
});
