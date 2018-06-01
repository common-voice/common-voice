import * as React from 'react';
import { MicIcon, PlayIcon, StopIcon } from '../../ui/icons';

import './primary-buttons.css';

export const PrimaryButton = ({
  className,
  ...props
}: React.ButtonHTMLAttributes<any>) => (
  <div
    className={[
      'primary-button',
      className,
      props.disabled ? 'disabled' : '',
    ].join(' ')}>
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

export const PlayButton = ({
  isPlaying,
  ...props
}: { isPlaying: boolean } & React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton className={isPlaying ? 'stop' : 'play'} {...props}>
    {isPlaying ? <StopIcon /> : <PlayIcon />}
  </PrimaryButton>
);
