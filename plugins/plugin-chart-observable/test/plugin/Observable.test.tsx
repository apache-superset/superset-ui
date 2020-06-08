import React from 'react';
import { mount, shallow } from 'enzyme';
import ObservableLoader from '../../src/chart/ObservableLoader';

describe('Observable', () => {
  const defaultProps = {
    width: 200,
    height: 200,
    data: ['dom', 'chart', 'd3'],
    observableUrl: 'https://observablehq.com/@emiliendupont/earthquake-3d-globe',
    displayedCells: ['dom', 'chart', 'd3'],
    dataInjectionCell: 'dom chart d3',
  };

  // eslint-disable-next-line jest/expect-expect
  it('renders', () => {
    shallow(<ObservableLoader {...defaultProps} />);
  });

  it('renders chart if there is a observableUrl', () => {
    const wrap = mount(<ObservableLoader {...defaultProps} />);
    expect(wrap.find('canvas')).toEqual(true);
  });
  it('does not render chart when there is no observableUrl', () => {
    const props = { ...defaultProps };
    props.observableUrl = '';
    const wrap = mount(<ObservableLoader {...props} />);
    expect(wrap.find('canvas')).toEqual(false);
  });
  it('renders basic data', () => {
    const wrap = mount(<ObservableLoader {...defaultProps} />);
    expect(wrap.find('canvas').prop('width')).toEqual(200);
    expect(wrap.find('canvas').prop('height')).toEqual(200);
  });

  it('renders children', () => {
    const wrap = mount(
      <ObservableLoader {...defaultProps}>
        <div>hello</div>
      </ObservableLoader>,
    );
    expect(wrap.find('hello')).toHaveLength(1);
  });
});
