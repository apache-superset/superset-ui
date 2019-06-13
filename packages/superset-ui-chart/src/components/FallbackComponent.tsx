import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export type Props = FallbackProps;

const CONTAINER_STYLE = {
  backgroundColor: '#000',
  color: '#fff',
  overflow: 'auto',
  padding: 32,
};

export default function FallbackComponent({ componentStack, error }: Props) {
  return (
    <div style={CONTAINER_STYLE}>
      <p>
        <div>
          <b>Oops! An error occured!</b>
        </div>
        <code>{error ? error.toString() : 'Unknown Error'}</code>
      </p>
      {componentStack && (
        <div>
          <b>Stack Trace:</b>
          <code>
            {componentStack.split('\n').map(row => (
              <div key={row}>{row}</div>
            ))}
          </code>
        </div>
      )}
    </div>
  );
}
