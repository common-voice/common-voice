import * as React from 'react';

export default ({
  children,
  progress,
  secondary,
}: {
  children?: any;
  progress: number;
  secondary?: boolean;
}) => (
  <div className="progress-bar">
    <div
      className={'progress ' + (secondary ? 'blue' : '')}
      style={
        progress > 0
          ? { width: 100 * progress + '%' }
          : { width: 0, padding: 0 }
      }>
      {children}
    </div>
  </div>
);
