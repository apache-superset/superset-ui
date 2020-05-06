import React from 'react';
import { shallow } from 'enzyme';
import { Tooltip } from 'react-bootstrap';
import InfoTooltipWithTrigger from '../src/InfoTooltipWithTrigger';

describe('InfoTooltipWithTrigger', () => {
  it('renders a tooltip', () => {
    const wrapper = shallow(<InfoTooltipWithTrigger label="test" tooltip="this is a test" />);
    expect(wrapper.find(Tooltip)).toHaveLength(1);
  });

  it('renders an info icon', () => {
    const wrapper = shallow(<InfoTooltipWithTrigger />);
    expect(wrapper.find('.fa-info-circle')).toHaveLength(1);
  });
});
