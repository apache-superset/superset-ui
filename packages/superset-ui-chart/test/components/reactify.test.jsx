import React from 'react';
import reactify from '../../src/components/reactify';

describe('reactify(renderFn)', () => {
  it('is a function', () => {
    expect(reactify).toBeInstanceOf(Function);
  });

  function renderFn(element, props) {
    const child = document.createElement('div');
    child.innerHTML = props.content;
    element.appendChild(child);
  }

  const TheChart = reactify(renderFn);
});
