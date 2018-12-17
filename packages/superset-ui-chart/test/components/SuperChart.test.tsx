import React from 'react';
import { mount, shallow } from 'enzyme';
import { ChartProps, ChartMetadata, ChartPlugin, SuperChart } from '../../src';

describe('SuperChart', () => {
  const TestComponent = () => <div className="test-component">test-component</div>;
  const chartProps = new ChartProps();

  class MyChartPlugin extends ChartPlugin {
    constructor() {
      super({
        metadata: new ChartMetadata({
          name: 'my-chart',
          thumbnail: '',
        }),
        Chart: TestComponent,
        transformProps: x => x,
      });
    }
  }

  class AnotherChartPlugin extends ChartPlugin {
    constructor() {
      super({
        metadata: new ChartMetadata({
          name: 'another-chart',
          thumbnail: '',
        }),
        loadChart: () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(TestComponent);
            }, 1000);
          }),
        transformProps: x => x,
      });
    }
  }

  new AnotherChartPlugin().configure({ key: 'another-chart' }).register();
  new MyChartPlugin().configure({ key: 'my-chart' }).register();

  describe('registered charts', () => {
    it('renders registered chart', done => {
      const wrapper = shallow(<SuperChart chartType="my-chart" chartProps={chartProps} />);
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        done();
      }, 10);
    });
    it('renders loading while waiting for Chart code to load', done => {
      const wrapper = shallow(<SuperChart chartType="another-chart" />);
      setTimeout(() => {
        expect(wrapper.render().find('.alert')).toHaveLength(0);
        done();
      }, 10);
    });
    it('renders if chartProps is not specified', done => {
      const wrapper = shallow(<SuperChart chartType="my-chart" />);
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(1);
        done();
      }, 10);
    });
    it('does not render if chartProps is null', done => {
      const wrapper = shallow(<SuperChart chartType="my-chart" chartProps={null} />);
      setTimeout(() => {
        expect(wrapper.render().find('div.test-component')).toHaveLength(0);
        done();
      }, 10);
    });
  });

  it('renders error message for unregistered chart', done => {
    const wrapper = mount(<SuperChart chartType="4d-pie-chart" chartProps={chartProps} />);
    setTimeout(() => {
      expect(wrapper.render().find('.alert')).toHaveLength(1);
      done();
    }, 10);
  });
});
