import React from 'react';
import { shallow } from 'enzyme';
import ChartMetadata from '../../src/models/ChartMetadata';
import ChartPlugin from '../../src/models/ChartPlugin';
import SuperChart from '../../src/components/SuperChart';

describe('SuperChart', () => {
  function TestComponent() {
    return <div className="test-component">test</div>;
  }

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
        Chart: () =>
          new Promise(resolve => {
            setTimeout(() => {
              resolve(TestComponent);
            }, 1000);
          }),
        transformProps: x => x,
      });
    }
  }

  it('renders registered chart', done => {
    new MyChartPlugin().configure({ key: 'my-chart' }).register();
    const wrapper = shallow(<SuperChart chartType="my-chart" />);
    setTimeout(() => {
      expect(wrapper.find(TestComponent)).toHaveLength(1);
      done();
    }, 100);
  });
  it('renders unregistered chart', done => {
    const wrapper = shallow(<SuperChart chartType="4d-pie-chart" />);
    setTimeout(() => {
      expect(wrapper.find('div')).toHaveLength(1);
      done();
    }, 10);
  });
  it('renders loading', done => {
    new AnotherChartPlugin().configure({ key: 'another-chart' }).register();
    const wrapper = shallow(<SuperChart chartType="another-chart" />);
    setTimeout(() => {
      const div = wrapper.find('div.alert');
      console.log('innerHTML', wrapper.html());
      expect(div).toHaveLength(1);
      done();
    }, 20);
  });
});
