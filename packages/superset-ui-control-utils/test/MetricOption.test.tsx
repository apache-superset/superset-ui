/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// @ts-nocheck
import React from 'react';
import { shallow } from 'enzyme';
import { InfoTooltipWithTrigger } from '@superset-ui/control-utils';

import MetricOption from '../src/MetricOption';
import ColumnTypeLabel from '../src/ColumnTypeLabel';

describe('MetricOption', () => {
  const defaultProps = {
    metric: {
      metric_name: 'foo',
      verbose_name: 'Foo',
      expression: 'SUM(foo)',
      description: 'Foo is the greatest metric of all',
      warning_text: 'Be careful when using foo',
    },
    showType: false,
  };

  let wrapper;
  let props;
  const factory = o => <MetricOption {...o} />;
  beforeEach(() => {
    wrapper = shallow(factory(defaultProps));
    props = { ...defaultProps };
  });
  it('is a valid element', () => {
    expect(React.isValidElement(<MetricOption {...defaultProps} />)).toBe(true);
  });
  it('shows a label with verbose_name', () => {
    const lbl = wrapper.find('.option-label');
    expect(lbl).toHaveLength(1);
    expect(lbl.first().text()).toBe('Foo');
  });
  it('shows 3 InfoTooltipWithTrigger', () => {
    expect(wrapper.find(InfoTooltipWithTrigger)).toHaveLength(3);
  });
  it('shows only 2 InfoTooltipWithTrigger when no descr', () => {
    props.metric.description = null;
    wrapper = shallow(factory(props));
    expect(wrapper.find(InfoTooltipWithTrigger)).toHaveLength(2);
  });
  it('shows a label with metric_name when no verbose_name', () => {
    props.metric.verbose_name = null;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    wrapper = shallow(factory(props));
    expect(wrapper.find('.option-label').first().text()).toBe('foo');
  });
  it('shows only 1 InfoTooltipWithTrigger when no descr and no warning', () => {
    props.metric.warning_text = null;
    wrapper = shallow(factory(props));
    expect(wrapper.find(InfoTooltipWithTrigger)).toHaveLength(1);
  });
  it('sets target="_blank" when openInNewWindow is true', () => {
    props.url = 'https://github.com/apache/incubator-superset';
    wrapper = shallow(factory(props));
    expect(wrapper.find('a').prop('target')).toBeNull();

    props.openInNewWindow = true;
    wrapper = shallow(factory(props));
    expect(wrapper.find('a').prop('target')).toBe('_blank');
  });
  it('shows a metric type label when showType is true', () => {
    props.showType = true;
    wrapper = shallow(factory(props));
    expect(wrapper.find(ColumnTypeLabel)).toHaveLength(1);
  });
});
