import PropTypes from 'prop-types';
import React from 'react';
import { mount } from 'enzyme';
import reactify from '../../src/components/reactify';

describe('reactify(renderFn)', () => {
  const renderFn = jest.fn((element, props) => {
    const container = element;
    container.innerHTML = '';
    const child = document.createElement('b');
    child.innerHTML = props.content;
    container.appendChild(child);
  });

  renderFn.displayName = 'BoldText';
  renderFn.propTypes = {
    content: PropTypes.string,
  };
  renderFn.defaultProps = {
    content: 'ghi',
  };

  const TheChart = reactify(renderFn);

  class TestComponent extends React.PureComponent {
    constructor(props) {
      super(props);
      this.state = { content: 'abc' };
    }

    componentDidMount() {
      setTimeout(() => {
        this.setState({ content: 'def' });
      }, 10);
    }

    render() {
      const { content } = this.state;

      return <TheChart content={content} />;
    }
  }

  it('returns a React component class', done => {
    const wrapper = mount(<TestComponent />);
    expect(renderFn).toHaveBeenCalledTimes(1);
    expect(wrapper.html()).toEqual('<div><b>abc</b></div>');
    setTimeout(() => {
      expect(renderFn).toHaveBeenCalledTimes(2);
      expect(wrapper.html()).toEqual('<div><b>def</b></div>');
      wrapper.unmount();
      done();
    }, 20);
  });
  it('inherits displayName from renderFn', () => {
    expect(TheChart.displayName).toEqual('BoldText');
  });
  it('inherits propTypes from renderFn', () => {
    /* eslint-disable-next-line react/forbid-foreign-prop-types */
    expect(TheChart.propTypes).toBe(renderFn.propTypes);
  });
  it('inherits defaultProps from renderFn', () => {
    expect(TheChart.defaultProps).toBe(renderFn.defaultProps);
    const wrapper = mount(<TheChart />);
    expect(wrapper.html()).toEqual('<div><b>ghi</b></div>');
  });
});
