import * as React from 'react';

export default ({
  children,
  progress,
}: {
  children?: any;
  progress: number;
}) => (
  <div className="progress-bar">
    <div
      className="progress"
      style={
        progress > 0
          ? { width: 100 * progress + '%' }
          : { width: 0, padding: 0 }
      }>
      {children}
    </div>
  </div>
);
