import React, { useState, ReactNode } from 'react';
import { DecoratorFunction } from '@storybook/addons';
import ResizablePanel, { Size } from './ResizablePanel';

export default function ResizableChartDemo({
  children,
  initialSize = { width: 500, height: 300 },
}: {
  children: (size: Size) => ReactNode;
  initialSize?: Size;
}) {
  // size are all inner size
  const [size, setSize] = useState(initialSize);
  return (
    <div className="superset-body">
      <ResizablePanel initialSize={initialSize} onResize={(e, data) => setSize(data.size)}>
        {children(size)}
      </ResizablePanel>
    </div>
  );
}

export const withResizableChartDemo: DecoratorFunction<ReactNode> = (storyFn, context) => {
  const {
    parameters: { initialSize },
  } = context;
  return (
    <ResizableChartDemo initialSize={initialSize as Size | undefined}>
      {size => storyFn({ ...context, ...size })}
    </ResizableChartDemo>
  );
};
