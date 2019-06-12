import {
  LocalizationProps,
  Localized,
  withLocalization,
} from 'fluent-react/compat';
import * as React from 'react';
import { useRef, useState } from 'react';
import { trackRecording } from '../../../../services/tracker';
import { useLocale } from '../../../locale-helpers';
import {
  PlayOutlineIcon,
  RedoIcon,
  ShareIcon,
  StopIcon,
} from '../../../ui/icons';
import { ContributionPillProps } from '../contribution';
import Pill, { PillStatus } from '../pill';
import { SentenceRecording } from './sentence-recording';

import './recording-pill.css';

const { Tooltip } = require('react-tippy');

interface Props extends ContributionPillProps, LocalizationProps {
  children?: React.ReactNode;
  clip: SentenceRecording;
  onRerecord: () => any;
  status: PillStatus;
}

function RecordingPill({
  children,
  clip,
  getString,
  onRerecord,
  onShare,
  status,
  ...props
}: Props) {
  const [locale] = useLocale();
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSentenceTooltip, setShowSentenceTooltip] = useState(false);
  const audioRef = useRef(null);

  const toggleIsPlaying = () => {
    const { current: audio } = audioRef;
    let nextIsPlaying = !isPlaying;
    if (nextIsPlaying) {
      trackRecording('listen', locale);
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(nextIsPlaying);
  };

  return (
    <Pill {...props} className="recording" openable status={status}>
      {children}

      {!children && status === 'active' && (
        <Localized id="record-cta">
          <div className="text" />
        </Localized>
      )}

      {!children && status === 'done' && (
        <React.Fragment>
          <audio
            src={clip.recording.url}
            preload="auto"
            onEnded={toggleIsPlaying}
            ref={audioRef}
          />
          <Tooltip
            arrow
            open={isPlaying || showSentenceTooltip}
            theme="grey-tooltip"
            title={clip.sentence.text}>
            <button
              className="play"
              type="button"
              onClick={toggleIsPlaying}
              onMouseEnter={() => setShowSentenceTooltip(true)}
              onMouseLeave={() => setShowSentenceTooltip(false)}>
              <span className="padder">
                {isPlaying ? <StopIcon /> : <PlayOutlineIcon />}
              </span>
            </button>
          </Tooltip>
          {isPlaying ? (
            <div className="placeholder" />
          ) : (
            <React.Fragment>
              <Tooltip arrow title={getString('review-tooltip')}>
                <button className="redo" type="button" onClick={onRerecord}>
                  <span className="padder">
                    <RedoIcon />
                  </span>
                </button>
              </Tooltip>
              <button className="share" type="button" onClick={onShare}>
                <span className="padder">
                  <ShareIcon />
                </span>
              </button>
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </Pill>
  );
}

export default withLocalization(RecordingPill);
