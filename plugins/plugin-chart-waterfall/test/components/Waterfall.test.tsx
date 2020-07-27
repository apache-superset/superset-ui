import React from 'react';
import { CommonWrapper, mount } from 'enzyme';
import { supersetTheme, ThemeProvider } from '@superset-ui/style';
import Waterfall from '../../src/components/Waterfall';
import transformProps from '../../src/plugin/transformProps';
import waterfallData from '../mocks/waterfallData';

describe('Waterfall chart', () => {
  let wrap: CommonWrapper;
  let tree: Cheerio;

  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const getWrapper = () =>
    mount(
      <ThemeProvider theme={supersetTheme}>
        {/*
        // @ts-ignore */}
        <Waterfall {...transformProps(waterfallData)} />
      </ThemeProvider>,
    );

  it('Render legend', () => {
    wrap = getWrapper();
    tree = wrap.render();
    const legend = tree.find('[data-test-id=legend]');
    expect(legend.children()).toHaveLength(4);
    expect(legend.children().eq(0).children().eq(1).text()).toEqual('Increase');
    expect(legend.children().eq(1).children().eq(1).text()).toEqual('Decrease');
    expect(legend.children().eq(2).children().eq(1).text()).toEqual('Total');
    expect(legend.children().eq(3).children().eq(1).text()).toEqual('Other');
  });

  it('Render ticks', () => {
    wrap = getWrapper();
    tree = wrap.render();
    const label2017 = tree.find('[data-test-id=tick-2017]');
    const labelFacebook = tree.find('[data-test-id=tick-Facebook]');
    expect(label2017).toBeDefined();
    expect(labelFacebook).toBeDefined();
  });

  it('Render Bars', () => {
    wrap = getWrapper();
    tree = wrap.render();
    const bars = tree.find('[data-test-id=bar]');
    expect(bars).toHaveLength(20);
    expect(bars[0].attribs.fill).toBe('#66BCFE');
    expect(bars[0].attribs.y).toBe('578');

    expect(bars[1].attribs.fill).toBe('#5AC189');
    expect(bars[1].attribs.y).toBe('420.35384');
  });
});
