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

export type RecordingStatus = null | 'waiting' | 'recording';

export const RecordButton = ({
  status,
  ...props
}: { status: RecordingStatus } & React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton
    className={status === null ? 'stop' : 'record'}
    {...props}
    disabled={status === 'waiting'}>
    {status === null && <MicIcon />}
    {status === 'recording' && <StopIcon />}
  </PrimaryButton>
);
