/* eslint-disable import/first */
import React from 'react';
import { mount, ReactWrapper } from 'enzyme';

jest.mock('resize-observer-polyfill');
// @ts-ignore
import { triggerResizeObserver } from 'resize-observer-polyfill';
import ErrorBoundary from 'react-error-boundary';
import { ChartProps, SuperChart } from '../../src';
import { ChartKeys, DiligentChartPlugin, BuggyChartPlugin } from './MockChartPlugins';
import promiseTimeout from './promiseTimeout';

function expectDimension(wrapper: ReactWrapper, width: number, height: number) {
  expect(
    wrapper
      .render()
      .find('span.dimension')
      .text(),
  ).toEqual([width, height].join('x'));
}

describe('SuperChart', () => {
  const plugins = [
    new DiligentChartPlugin().configure({ key: ChartKeys.DILIGENT }),
    new BuggyChartPlugin().configure({ key: ChartKeys.BUGGY }),
  ];

  beforeAll(() => {
    plugins.forEach(p => {
      p.unregister().register();
    });
  });

  afterAll(() => {
    plugins.forEach(p => {
      p.unregister();
    });
  });

  describe('includes ErrorBoundary', () => {
    it('renders default FallbackComponent', () => {
      const wrapper = mount(
        <ErrorBoundary onError={() => 'omg omg'}>
          <SuperChart chartType={ChartKeys.BUGGY} width="200" height="200" />
        </ErrorBoundary>,
      );
      const renderedWrapper = wrapper.render();

      return promiseTimeout(() => {
        expect(renderedWrapper.find('div.test-component')).toHaveLength(0);
        console.log('wrapper.render()', renderedWrapper.find('p').html());
        expect(renderedWrapper.find('p strong')).toHaveLength(1);
      }, 100);
    });
    it('renders custom FallbackComponent', () => {
      const CustomFallbackComponent = jest.fn(() => <div>Custom Fallback!</div>);
      const wrapper = mount(
        <SuperChart
          chartType={ChartKeys.BUGGY}
          width="200"
          height="200"
          FallbackComponent={CustomFallbackComponent}
        />,
      );

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(0);
        expect(CustomFallbackComponent).toBeCalledTimes(1);
      });
    });
    it('call onErrorBoundary', () => {
      const handleError = jest.fn();
      mount(
        <SuperChart
          chartType={ChartKeys.BUGGY}
          width="200"
          height="200"
          onErrorBoundary={handleError}
        />,
      );

      return promiseTimeout(() => {
        expect(handleError).toHaveBeenCalledTimes(1);
      });
    });
    it('does not include ErrorBoundary if told so', () => {
      const inactiveErrorHandler = jest.fn();
      const activeErrorHandler = jest.fn();
      mount(
        <ErrorBoundary onError={activeErrorHandler}>
          <SuperChart
            chartType={ChartKeys.BUGGY}
            width="200"
            height="200"
            disableErrorBoundary
            onErrorBoundary={inactiveErrorHandler}
          />
        </ErrorBoundary>,
      );

      return promiseTimeout(() => {
        expect(activeErrorHandler).toHaveBeenCalledTimes(1);
        expect(inactiveErrorHandler).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('supports multiple way of specifying chartProps', () => {
    it('chartProps is instanceof ChartProps', () => {
      const wrapper = mount(
        <SuperChart
          chartType={ChartKeys.DILIGENT}
          chartProps={new ChartProps({ width: 20, height: 20 })}
        />,
      );

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 20, 20);
      });
    });
    it('chartProps is ChartPropsConfig', () => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} chartProps={{ width: 201, height: 202 }} />,
      );

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 201, 202);
      });
    });
    it('fields of chartProps are listed as props of SuperChart', () => {
      const wrapper = mount(<SuperChart chartType={ChartKeys.DILIGENT} width={101} height={118} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 101, 118);
      });
    });
  });

  describe('supports dynamic width and/or height', () => {
    it('works with width and height that are numbers', () => {
      const wrapper = mount(<SuperChart chartType={ChartKeys.DILIGENT} width={100} height={100} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 100, 100);
      });
    });
    it('works when width and height are percent', () => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="100%" height="100%" />,
      );
      triggerResizeObserver();

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 300, 300);
      }, 100);
    });
    it('works when only width is percent', () => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="50%" height="125" />,
      );
      triggerResizeObserver();

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 150, 125);
      }, 100);
    });
    it('works when only height is percent', () => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="50" height="25%" />,
      );
      triggerResizeObserver();

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 50, 75);
      }, 100);
    });
    it('works when width and height are not specified', () => {
      const wrapper = mount(<SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} />);
      triggerResizeObserver();

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expectDimension(wrapper, 300, 400);
      }, 100);
    });
  });
});
