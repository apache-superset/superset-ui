import React from 'react';
import { shallow } from 'enzyme';
import { WithLegend } from '../../src';

describe('WithLegend', () => {
  it('sets className', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  // it('renders when renderLegend is not set', () => {
  //   const wrapper = shallow(
  //     <WithLegend
  //       width={500}
  //       height={500}
  //       className="test-class"
  //       renderChart={() => <div className="chart" />}
  //     />,
  //   );
  //   expect(wrapper.find('div.chart')).toHaveLength(1);
  //   expect(wrapper.find('div.legend')).toHaveLength(0);
  // });

  // it('renders', () => {
  //   const renderChart = jest.fn(() => <div className="chart" />);
  //   const renderLegend = jest.fn(() => <div className="legend" />);

  //   const div = document.createElement('div');
  //   document.body.appendChild(div);
  //   const wrapper = mount(
  //     <WithLegend width={500} height={500} renderChart={renderChart} renderLegend={renderLegend} />,
  //     {
  //       attachTo: div,
  //     },
  //   );
  // });
});
