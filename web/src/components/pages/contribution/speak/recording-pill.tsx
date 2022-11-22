import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react';
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
import { getAudioFormat } from '../../../../utility';
import { ContributionPillProps } from '../contribution';
import Pill, { PillStatus } from '../pill';
import { SentenceRecording } from './sentence-recording';

import './recording-pill.css';

const { Tooltip } = require('react-tippy');

interface Props extends ContributionPillProps, WithLocalizationProps {
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
      setShowSentenceTooltip(false);
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
        <>
          <audio preload="auto" onEnded={toggleIsPlaying} ref={audioRef}>
            <source src={clip.recording.url} type={getAudioFormat()} />
          </audio>
          <Tooltip
            arrow
            open={isPlaying || showSentenceTooltip}
            theme="dark"
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
            <>
              <Tooltip arrow title={getString('review-tooltip')}>
                <button className="redo" type="button" onClick={onRerecord}>
                  <span className="padder">
                    <RedoIcon />
                  </span>
                </button>
              </Tooltip>
            </>
          )}
        </>
      )}
    </Pill>
  );
}

export default withLocalization(RecordingPill);
