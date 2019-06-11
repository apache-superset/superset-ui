import React from 'react';
import { shallow } from 'enzyme';
import FallbackComponent from '../../src/components/FallbackComponent';

describe('FallbackComponent', () => {
  const ERROR = new Error('CaffeineOverLoadException');
  const STACK_TRACE = 'Error at line 1: x.drink(coffee)';

  it('renders error and stack trace', () => {
    const wrapper = shallow(<FallbackComponent componentStack={STACK_TRACE} error={ERROR} />);
    const span = wrapper.find('span');
    expect(span).toHaveLength(2);
    expect(span.at(0).text()).toEqual('Error: CaffeineOverLoadException');
    expect(span.at(1).text()).toEqual('Error at line 1: x.drink(coffee)');
  });

  it('renders error only', () => {
    const wrapper = shallow(<FallbackComponent error={ERROR} />);
    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.at(0).text()).toEqual('Error: CaffeineOverLoadException');
  });

  it('renders stacktrace only', () => {
    const wrapper = shallow(<FallbackComponent componentStack={STACK_TRACE} />);
    const span = wrapper.find('span');
    expect(span).toHaveLength(2);
    expect(span.at(0).text()).toEqual('Error: Unknown Error');
    expect(span.at(1).text()).toEqual('Error at line 1: x.drink(coffee)');
  });

  it('renders when nothing is given', () => {
    const wrapper = shallow(<FallbackComponent />);
    const span = wrapper.find('span');
    expect(span).toHaveLength(1);
    expect(span.at(0).text()).toEqual('Error: Unknown Error');
  });
});
