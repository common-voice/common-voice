import * as React from 'react';
import URLS from '../../urls';
import { LocaleLink } from '../locale-helpers';
import { getTrackClass } from '../../services/tracker';
import { MicIcon, OldPlayIcon, StopIcon } from '../ui/icons';

import './primary-buttons.css';

export const PrimaryButton = ({
  className,
  to,
  trackClass,
  ...props
}: { to?: string; trackClass?: string } & React.ButtonHTMLAttributes<any>) => {
  return (
    <div
      className={[
        'primary-button',
        className,
        props.disabled ? 'disabled' : '',
        trackClass ? getTrackClass('fs', trackClass) : '',
      ].join(' ')}>
      {to ? (
        <LocaleLink to={to} {...props} />
      ) : (
        <button type="button" {...props} />
      )}
      <div className="background" />
    </div>
  );
};

export type RecordingStatus = null | 'waiting' | 'recording';

export const RecordButton = ({
  status,
  trackClass,
  ...props
}: {
  status: RecordingStatus;
  trackClass?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {

  return (
    <button
      className={`${status === null ? 'stop' : 'record'} ${trackClass || ''}`}
      disabled={status === 'waiting'}
      {...props}
    >
      {status === 'recording' ? (
        <img src="/img/pause-icon.svg" alt="pause icon" />
      ) : (
        <img src="/img/mic-icon.svg" alt="play icon" />
      )}
    </button>
  );
};

export const RecordLink = (props: any) => (
  <PrimaryButton className="stop" to={URLS.SPEAK} {...props}>
    <MicIcon />
  </PrimaryButton>
);

export const Voice = (props: any) => (
  <PrimaryButton className="stop" {...props} />
);

export const PlayButton = ({
  isPlaying,
  trackClass,
  ...props
}: {
  isPlaying: boolean;
  trackClass?: string;
} & React.ButtonHTMLAttributes<any>) => (
  <PrimaryButton
      className={`${isPlaying  ? 'stop' : 'play'} ${trackClass || ''}`}
      {...props}
    >
      {isPlaying ? (
        <img src="/img/pause-icon.svg" alt="pause icon" />
      ) : (
        <img
        src="/img/play-icon.svg"
        alt="play-icon"
  
      />
      )}
    </PrimaryButton>

);

export const PlayLink = (props: any) => (
  <PrimaryButton className="play" to={URLS.LISTEN} {...props}>
    <OldPlayIcon />
  </PrimaryButton>
);
