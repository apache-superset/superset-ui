import React from 'react';
import { CommonWrapper, mount } from 'enzyme';
import { supersetTheme, ThemeProvider } from '@superset-ui/style';
import { ChartProps } from '@superset-ui/chart';
import BarChart from '../../src/components/BarChart';
import transformProps from '../../src/plugin/transformProps';
import barChartData from '../mocks/barChartData';

describe('Bar chart', () => {
  let wrap: CommonWrapper;
  let tree: Cheerio;

  beforeEach(() => {
    // Recharts still have some UNSAFE react functions that failing test
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const getWrapper = (
    props: Partial<ChartProps> = {
      formData: {},
    },
  ) =>
    mount(
      <ThemeProvider theme={supersetTheme}>
        <BarChart
          // @ts-ignore
          {...transformProps({
            ...barChartData,
            formData: {
              ...barChartData.formData,
              ...props.formData,
            },
          })}
          isAnimationActive={false}
        />
      </ThemeProvider>,
    );

  it('Render ticks', () => {
    wrap = getWrapper();
    tree = wrap.render();
    const xLabelLong = tree.find('[data-test-id="tick-Halo TV, Total Perio..."]');
    const xLabelShort = tree.find('[data-test-id="tick-Halo TV, 2018"]');
    const yLabel = tree.find('[data-test-id="tick-800k"]');
    expect(xLabelLong).toHaveLength(1);
    expect(xLabelShort).toHaveLength(1);

    expect(xLabelLong.children('text')[0].attribs.transform).toBe('rotate(-45, 0, 5)');
    expect(yLabel.children('text')[0].attribs.transform).toBe('rotate(-90, -5, 0)');
  });

  it('Render stacked bars', () => {
    wrap = getWrapper();
    tree = wrap.render();
    const bars = tree.find('.recharts-layer.recharts-bar-rectangle path');
    expect(bars).toHaveLength(40);
    expect(bars[0].attribs.y).toBe('47.18900266666665');
    expect(bars[0].attribs.height).toBe('350.8109973333334');
    expect(bars[0].attribs.fill).toBe('#1f77b4');

    expect(bars[20].attribs.y).toBe('3.337628000000002');
    expect(bars[20].attribs.height).toBe('43.85137466666665');
    expect(bars[20].attribs.fill).toBe('#ff7f0e');
  });

  it('Render not stacked bars', () => {
    wrap = getWrapper({ formData: { stackedBars: false } });
    tree = wrap.render();
    const bars = tree.find('.recharts-layer.recharts-bar-rectangle path');
    expect(bars).toHaveLength(40);
    expect(bars[0].attribs.y).toBe('22.131074285714273');
    expect(bars[0].attribs.height).toBe('375.86892571428575');
    expect(bars[0].attribs.fill).toBe('#1f77b4');

    expect(bars[20].attribs.y).toBe('351.01638428571425');
    expect(bars[20].attribs.height).toBe('46.98361571428575');
    expect(bars[20].attribs.fill).toBe('#ff7f0e');
  });

  it('Render vertical layout with stacked bars', () => {
    wrap = getWrapper({ formData: { layout: 'vertical' } });
    tree = wrap.render();
    const bars = tree.find('.recharts-layer.recharts-bar-rectangle path');
    expect(bars).toHaveLength(40);
    expect(bars[0].attribs.x).toBe('50');
    expect(bars[0].attribs.width).toBe('402.8156426666667');
    expect(bars[0].attribs.fill).toBe('#1f77b4');

    expect(bars[20].attribs.x).toBe('452.8156426666667');
    expect(bars[20].attribs.width).toBe('50.35195533333331');
    expect(bars[20].attribs.fill).toBe('#ff7f0e');
  });

  it('Render vertical layout with not stacked bars', () => {
    wrap = getWrapper({ formData: { layout: 'vertical', stackedBars: false } });
    tree = wrap.render();
    const bars = tree.find('.recharts-layer.recharts-bar-rectangle path');
    expect(bars).toHaveLength(40);
    expect(bars[0].attribs.x).toBe('50');
    expect(bars[0].attribs.width).toBe('431.5881885714286');
    expect(bars[0].attribs.fill).toBe('#1f77b4');

    expect(bars[20].attribs.x).toBe('50');
    expect(bars[20].attribs.width).toBe('53.94852357142858');
    expect(bars[20].attribs.fill).toBe('#ff7f0e');
  });
});
