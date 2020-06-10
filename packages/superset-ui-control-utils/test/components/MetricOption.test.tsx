import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
import { MetricOption, MetricOptionProps } from '../../src/MetricOption';

describe('MetricOption', () => {
  const defaultProps = {
    metric: {
      metric_name: 'foo',
      verbose_name: 'Foo',
      expression: 'SUM(foo)',
      label: 'test',
      description: 'Foo is the greatest metric of all',
      warning_text: 'Be careful when using foo',
    },
    openInNewWindow: false,
    showFormula: true,
    showType: true,
    url: '',
  };

  let wrapper: ShallowWrapper;
  let props: MetricOptionProps;
  const factory = (o: MetricOptionProps) => <MetricOption {...o} />;
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
    expect(wrapper.find('InfoTooltipWithTrigger')).toHaveLength(3);
  });
  it('shows only 2 InfoTooltipWithTrigger when no descr', () => {
    props.metric.description = '';
    wrapper = shallow(factory(props));
    expect(wrapper.find('InfoTooltipWithTrigger')).toHaveLength(2);
  });
  it('shows a label with metric_name when no verbose_name', () => {
    props.metric.verbose_name = '';
    wrapper = shallow(factory(props));
    expect(wrapper.find('.option-label').first().text()).toBe('foo');
  });
  it('shows only 1 InfoTooltipWithTrigger when no descr and no warning', () => {
    props.metric.warning_text = '';
    wrapper = shallow(factory(props));
    expect(wrapper.find('InfoTooltipWithTrigger')).toHaveLength(1);
  });
  it('sets target="_blank" when openInNewWindow is true', () => {
    props.url = 'https://github.com/apache/incubator-superset';
    wrapper = shallow(factory(props));
    expect(wrapper.find('a').prop('target')).toBe('');

    props.openInNewWindow = true;
    wrapper = shallow(factory(props));
    expect(wrapper.find('a').prop('target')).toBe('_blank');
  });
  it('shows a metric type label when showType is true', () => {
    props.showType = true;
    wrapper = shallow(factory(props));
    expect(wrapper.find('ColumnTypeLabel')).toHaveLength(1);
  });
});
