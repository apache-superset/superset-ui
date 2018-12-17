import React from 'react';
import { mount, shallow } from 'enzyme';
import ChartMetadata from '../../src/models/ChartMetadata';
import ChartPlugin from '../../src/models/ChartPlugin';
import SuperChart from '../../src/components/SuperChart';

describe('SuperChart', () => {
  const TestComponent = () => <div className="test-component">test-component</div>;

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

  new MyChartPlugin().configure({ key: 'my-chart' }).register();
  new AnotherChartPlugin().configure({ key: 'another-chart' }).register();

  it('renders registered chart', done => {
    const wrapper = shallow(<SuperChart chartType="my-chart" />);
    setTimeout(() => {
      expect(wrapper.render().find('div.test-component')).toHaveLength(1);
      done();
    }, 10);
  });
  it('renders error message for unregistered chart', done => {
    const wrapper = mount(<SuperChart chartType="4d-pie-chart" />);
    setTimeout(() => {
      expect(wrapper.render().find('.alert')).toHaveLength(1);
      done();
    }, 10);
  });
  it('renders loading', done => {
    const wrapper = shallow(<SuperChart chartType="another-chart" />);
    setTimeout(() => {
      expect(wrapper.render().find('.alert')).toHaveLength(0);
      done();
    }, 10);
  });
});
