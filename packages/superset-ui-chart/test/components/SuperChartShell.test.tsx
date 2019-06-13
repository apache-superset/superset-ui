/* eslint-disable import/first */
import React from 'react';
import { mount } from 'enzyme';

jest.mock('resize-observer-polyfill');
// @ts-ignore
import { triggerResizeObserver } from 'resize-observer-polyfill';
import { ChartProps, SuperChart } from '../../src';
import { ChartKeys, DiligentChartPlugin, BuggyChartPlugin } from './MockChartPlugins';

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
    it('renders default FallbackComponent', () => {});
    it('renders custom FallbackComponent', () => {});
    it('call onError', () => {});
    it('does not include ErrorBoundary if told so', () => {});
  });

  describe('supports multiple way of specifying chartProps', () => {
    it('chartProps is instanceof ChartProps', done => {
      const wrapper = mount(
        <SuperChart
          chartType={ChartKeys.DILIGENT}
          chartProps={new ChartProps({ width: 20, height: 20 })}
        />,
      );
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('20x20');
        done();
      }, 0);
    });
    it('chartProps is ChartPropsConfig', done => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} chartProps={{ width: 201, height: 202 }} />,
      );
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('201x202');
        done();
      }, 0);
    });
    it('fields of chartProps are listed as props of SuperChart', done => {
      const wrapper = mount(<SuperChart chartType={ChartKeys.DILIGENT} width={101} height={118} />);
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('101x118');
        done();
      }, 0);
    });
  });

  describe('supports dynamic width and/or height', () => {
    it('works with width and height that are numbers', done => {
      const wrapper = mount(<SuperChart chartType={ChartKeys.DILIGENT} width={100} height={100} />);
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('100x100');
        done();
      }, 0);
    });
    it('works when width and height are percent', done => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="100%" height="100%" />,
      );
      triggerResizeObserver();
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('300x300');
        done();
      }, 100);
    });
    it('works when only width is percent', done => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="50%" height="125" />,
      );
      triggerResizeObserver();
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('150x125');
        done();
      }, 100);
    });
    it('works when only height is percent', done => {
      const wrapper = mount(
        <SuperChart chartType={ChartKeys.DILIGENT} debounceTime={1} width="50" height="25%" />,
      );
      triggerResizeObserver();
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        expect(
          wrapper
            .render()
            .find('span.dimension')
            .text(),
        ).toEqual('50x75');
        done();
      }, 100);
    });
  });
});
