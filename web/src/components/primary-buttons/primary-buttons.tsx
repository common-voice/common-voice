import * as React from 'react';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import { MicIcon, OldPlayIcon, StopIcon } from '../ui/icons';

import './primary-buttons.css';

export const PrimaryButton = ({
  className,
  to,
  ...props
}: { to?: string } & React.ButtonHTMLAttributes<any>) => (
  <div
    className={[
      'primary-button',
      className,
      props.disabled ? 'disabled' : '',
    ].join(' ')}>
    {to ? (
      <LocaleLink to={to} {...props} />
    ) : (
      <button type="button" {...props} />
    )}
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

export const RecordLink = (props: any) => (
  <PrimaryButton className="stop" to={URLS.SPEAK} {...props}>
    <MicIcon />
  </PrimaryButton>
);

export const PlayButton = ({
  isPlaying,
  ...props
}: { isPlaying: boolean } & React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton className={isPlaying ? 'stop' : 'play'} {...props}>
    {isPlaying ? <StopIcon /> : <OldPlayIcon />}
  </PrimaryButton>
);

export const PlayLink = (props: any) => (
  <PrimaryButton className="play" to={URLS.LISTEN} {...props}>
    <OldPlayIcon />
  </PrimaryButton>
);
