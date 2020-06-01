import React, { PropsWithChildren, ReactNode } from 'react';
import { ResizableBox, ResizableBoxProps, ResizeCallbackData } from 'react-resizable';

import 'react-resizable/css/styles.css';

export type Size = ResizeCallbackData['size'];

export default function ResizablePanel({
  children,
  heading = undefined,
  initialSize = { width: 500, height: 300 },
  minConstraints = [100, 100] as [number, number],
  panelPadding = 30,
  onResize,
  ...props
}: PropsWithChildren<Omit<ResizableBoxProps, 'width' | 'height'>> & {
  heading?: ReactNode;
  panelPadding?: number;
  initialSize?: Size;
}) {
  const { width, height } = initialSize;
  return (
    <ResizableBox
      className="panel"
      width={width + panelPadding}
      height={height + panelPadding}
      minConstraints={minConstraints}
      onResize={
        onResize
          ? (e, data) => {
              const { size } = data;
              onResize(e, {
                ...data,
                size: { width: size.width - panelPadding, height: size.height - panelPadding },
              });
            }
          : undefined
      }
      {...props}
    >
      {heading ? <div className="panel-heading">{heading}</div> : null}
      <div className="panel-body">{children}</div>
    </ResizableBox>
  );
}
