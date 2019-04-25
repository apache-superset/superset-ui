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

  it('renders legend at default position', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  it('renders legend with justifyContent specified', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        legendJustifyContent="flex-start"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  it('renders legend on the top', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        position="top"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  it('renders legend on the right', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        position="right"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  it('renders legend on the bottom', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        position="bottom"
        renderChart={() => <div className="chart" />}
        renderLegend={() => <div className="legend" />}
      />,
    );
    expect(wrapper.hasClass('test-class')).toEqual(true);
  });

  it('renders legend on the left', () => {
    const wrapper = shallow(
      <WithLegend
        className="test-class"
        position="left"
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
