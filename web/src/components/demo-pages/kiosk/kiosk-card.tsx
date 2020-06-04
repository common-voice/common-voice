import * as React from 'react';

const KioskCard = {
  Top: ({ children }: React.PropsWithChildren<any>) => (
    <div id="kiosk-card--top">
      <div id="kiosk-card--top--gradient-layer"></div>
      {/* the top */}
      <div id="kiosk-card-top--button">{children}</div>
    </div>
  ),
  Body: ({ children }: React.PropsWithChildren<any>) => (
    <div id="kiosk-card--body">{children}</div>
  ),

  Bottom: ({ children }: React.PropsWithChildren<any>) => (
    <div id="kiosk-card--bottom">{children}</div>
  ),
};

export default KioskCard;
