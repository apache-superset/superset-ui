import React from 'react';
import { createMockStore } from 'redux-test-utils';
import { mount, shallow } from 'enzyme';
import ObservableLoader from '../../src/chart/ObservableLoader';

// @ts-ignore
const shallowWithStore = (component, store) => {
  const context = {
    store,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return shallow(component, { context });
};
// @ts-ignore
const mountWithStore = (component, store) => {
  const context = {
    store,
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  return mount(component, { context });
};
describe('Observable', () => {
  const defaultProps = {
    width: 200,
    height: 200,
    data: ['dom', 'chart', 'd3'],
    observableUrl: 'https://observablehq.com/@emiliendupont/earthquake-3d-globe',
    displayedCells: ['dom', 'chart', 'd3'],
    dataInjectionCell: 'dom chart d3',
  };
  const testState = {};
  const store = createMockStore(testState);
  const wrap = shallowWithStore(<ObservableLoader {...defaultProps} />, store);
  // eslint-disable-next-line jest/expect-expect
  it('renders', () => {
    shallowWithStore(<ObservableLoader {...defaultProps} />, store);
  });

  it('takes in props', () => {
    expect(wrap.find('ObservableLoader').prop('width')).toEqual(200);
    expect(wrap.find('ObservableLoader').prop('height')).toEqual(200);
    expect(wrap.find('ObservableLoader').prop('observableUrl')).toEqual(
      'https://observablehq.com/@emiliendupont/earthquake-3d-globe',
    );
    expect(wrap.find('ObservableLoader').prop('dataInjectionCell')).toEqual('dom chart d3');
  });

  it('renders children', () => {
    const childWrap = mountWithStore(
      <ObservableLoader {...defaultProps}>
        <div id="child">hello</div>
      </ObservableLoader>,
      store,
    );
    expect(childWrap.find('#child')).toHaveLength(1);
  });
});
