import React from 'react';
import { FallbackProps } from 'react-error-boundary';

export type Props = FallbackProps;

export default function FallbackComponent({ componentStack, error }: Props) {
  return (
    <div>
      <p>
        <strong>Oops! An error occured!</strong>
      </p>
      <p>Here’s what we know…</p>
      <p>
        <strong>Error:</strong> <span>{error ? error.toString() : 'Unknown Error'}</span>
      </p>
      {componentStack && (
        <p>
          <strong>Stacktrace:</strong> <span>{componentStack}</span>
        </p>
      )}
    </div>
  );
}
