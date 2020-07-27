import React from 'react';
import { CommonWrapper, mount } from 'enzyme';
import Waterfall from '../../src/components/Waterfall';
import transformProps from '../../src/plugin/transformProps';
import waterfallData from '../mocks/waterfallData';

describe('Waterfall chart', () => {
  let wrap: CommonWrapper; // the ReactDataTable wraper
  let tree: Cheerio;

  it('Render legend', () => {
    // @ts-ignore
    wrap = mount(<Waterfall {...transformProps(waterfallData)} />);
    tree = wrap.render();
    const legend = tree.find('[data-test-id=legend]');
    expect(legend).toHaveLength(4);
    expect(legend.eq(0).eq(1).text()).toEqual('Increase');
    expect(legend.eq(1).eq(1).text()).toEqual('Decrease');
    expect(legend.eq(2).eq(1).text()).toEqual('Total');
    expect(legend.eq(3).eq(1).text()).toEqual('Other');
  });
});
