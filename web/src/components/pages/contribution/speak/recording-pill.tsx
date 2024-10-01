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
  StopIcon,
} from '../../../ui/icons';
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
  const audioContext = useRef(null);
  const source = useRef(null);

  const toggleIsPlaying = () => {
    const nextIsPlaying = !isPlaying;

    if (nextIsPlaying) {
      trackRecording('listen', locale);

      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
      source.current = audioContext.current.createBufferSource();

      clip.recording.blob.arrayBuffer().then(arrayBuffer => {
        audioContext.current.decodeAudioData(arrayBuffer).then((audioBuffer: any) =>{
          source.current.buffer = audioBuffer
          source.current.onended = () => {
            source.current = audioContext.current.createBufferSource();
            setShowSentenceTooltip(false);
            setIsPlaying(false);
          }
          source.current.connect(audioContext.current.destination);
          source.current.start(0);
        });
      });
    } else {
      source.current.stop(0);
      setShowSentenceTooltip(false);
    }
    setIsPlaying(nextIsPlaying);
  };

  return (
    <Pill {...props} className="recording" openable status={status} style={{ 
      backgroundColor: !children && status === 'done' ? '#ECFDF3' :'#ffffff',
      border: !children && status === 'done' ? '1px solid #ABEFC6' : '1px solid #D2D6DB',
      borderRadius: '8px',
      color: !children && status === 'done' ? '#085D3A' : '#9DA4AE',
    height: '44px',
    padding: '8px',
    opacity: status == 'pending' ? '0.5' : '1',
    }}  >
      {children}

      {(!children && (status === 'active' || status === 'pending')) && (
  <Localized id="record-cta">
    <div className="text" />
  </Localized>
)}

      {!children && status === 'done' && (
        <>
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
                {isPlaying ? <StopIcon /> : <img src="/img/play-rounded.svg" alt="play-icon" />}
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
                    <img src="/img/repeat-rounded.svg" alt="repeat-icon" />
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
