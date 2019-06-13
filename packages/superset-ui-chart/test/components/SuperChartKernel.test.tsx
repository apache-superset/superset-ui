import React from 'react';
import { mount, shallow } from 'enzyme';
import { ChartProps } from '../../src';
import {
  ChartKeys,
  DiligentChartPlugin,
  LazyChartPlugin,
  SlowChartPlugin,
} from './MockChartPlugins';
import SuperChartKernel from '../../src/components/SuperChartKernel';
import promiseTimeout from './promiseTimeout';

describe('SuperChartKernel', () => {
  const chartProps = new ChartProps();

  const plugins = [
    new DiligentChartPlugin().configure({ key: ChartKeys.DILIGENT }),
    new LazyChartPlugin().configure({ key: ChartKeys.LAZY }),
    new SlowChartPlugin().configure({ key: ChartKeys.SLOW }),
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

  describe('registered charts', () => {
    it('renders registered chart', () => {
      const wrapper = shallow(
        <SuperChartKernel chartType={ChartKeys.DILIGENT} chartProps={chartProps} />,
      );

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
      });
    });
    it('renders registered chart with lazy loading', () => {
      const wrapper = shallow(<SuperChartKernel chartType={ChartKeys.LAZY} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
      });
    });
    it('does not render if chartType is not set', () => {
      // @ts-ignore chartType is required
      const wrapper = shallow(<SuperChartKernel />);

      return promiseTimeout(() => {
        expect(wrapper.render().children()).toHaveLength(0);
      }, 5);
    });
    it('adds id to container if specified', () => {
      const wrapper = shallow(<SuperChartKernel chartType={ChartKeys.DILIGENT} id="the-chart" />);

      return promiseTimeout(() => {
        expect(wrapper.render().attr('id')).toEqual('the-chart');
      });
    });
    it('adds class to container if specified', () => {
      const wrapper = shallow(
        <SuperChartKernel chartType={ChartKeys.DILIGENT} className="the-chart" />,
      );

      return promiseTimeout(() => {
        expect(wrapper.hasClass('the-chart')).toBeTruthy();
      }, 0);
    });
    it('uses overrideTransformProps when specified', () => {
      const wrapper = shallow(
        <SuperChartKernel
          chartType={ChartKeys.DILIGENT}
          overrideTransformProps={() => ({ message: 'hulk' })}
        />,
      );

      return promiseTimeout(() => {
        expect(
          wrapper
            .render()
            .find('.message')
            .text(),
        ).toEqual('hulk');
      });
    });
    it('uses preTransformProps when specified', () => {
      const chartPropsWithPayload = new ChartProps({
        payload: { message: 'hulk' },
      });
      const wrapper = shallow(
        <SuperChartKernel
          chartType={ChartKeys.DILIGENT}
          preTransformProps={() => chartPropsWithPayload}
          overrideTransformProps={props => props.payload}
        />,
      );

      return promiseTimeout(() => {
        expect(
          wrapper
            .render()
            .find('.message')
            .text(),
        ).toEqual('hulk');
      });
    });
    it('uses postTransformProps when specified', () => {
      const wrapper = shallow(
        <SuperChartKernel
          chartType={ChartKeys.DILIGENT}
          postTransformProps={() => ({ message: 'hulk' })}
        />,
      );

      return promiseTimeout(() => {
        expect(
          wrapper
            .render()
            .find('.message')
            .text(),
        ).toEqual('hulk');
      });
    });
    it('renders if chartProps is not specified', () => {
      const wrapper = shallow(<SuperChartKernel chartType={ChartKeys.DILIGENT} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
      });
    });
    it('does not render anything while waiting for Chart code to load', () => {
      const wrapper = shallow(<SuperChartKernel chartType={ChartKeys.SLOW} />);

      return promiseTimeout(() => {
        expect(wrapper.render().children()).toHaveLength(0);
      });
    });
    it('eventually renders after Chart is loaded', () => {
      const wrapper = shallow(<SuperChartKernel chartType={ChartKeys.SLOW} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
      }, 1500);
    });
    it('does not render if chartProps is null', () => {
      const wrapper = shallow(
        <SuperChartKernel chartType={ChartKeys.DILIGENT} chartProps={null} />,
      );

      return promiseTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(0);
      });
    });
  });

  describe('unregistered charts', () => {
    it('renders error message', () => {
      const wrapper = mount(<SuperChartKernel chartType="4d-pie-chart" chartProps={chartProps} />);

      return promiseTimeout(() => {
        expect(wrapper.render().find('.alert')).toHaveLength(1);
      });
    });
  });

  describe('.processChartProps()', () => {
    it('use identity functions for unspecified transforms', () => {
      const chart = new SuperChartKernel({
        chartType: ChartKeys.DILIGENT,
      });
      const chartProps2 = new ChartProps();
      expect(chart.processChartProps({ chartProps: chartProps2 })).toBe(chartProps2);
    });
  });
});
