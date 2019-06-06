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
        <strong>Error:</strong> {error ? error.toString() : 'undefined'}
      </p>
      <p>
        <strong>Stacktrace:</strong> {componentStack}
      </p>
    </div>
  );
}
