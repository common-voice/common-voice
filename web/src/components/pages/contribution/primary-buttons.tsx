import * as React from 'react';
import { MicIcon, StopIcon } from '../../ui/icons';

import './primary-buttons.css';

export const PrimaryButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<any>) => (
  <div className={'primary-button ' + className}>
    <button type="button" {...props} />
    <div className="background" />
  </div>
);

export const RecordButton = (props: React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton className="record" {...props}>
    <MicIcon />
  </PrimaryButton>
);

export const StopButton = (props: React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton className="stop" {...props}>
    <StopIcon />
  </PrimaryButton>
);
