import React, { ReactNode } from 'react';

interface ControlHeaderProps {
  children: ReactNode;
}

export const ControlHeader = ({ children }: ControlHeaderProps): JSX.Element => {
  return (
    <div className="ControlHeader">
      <div className="pull-left">
        <label>
          <span role={'button'}>{children}</span>
        </label>
      </div>
    </div>
  );
};
