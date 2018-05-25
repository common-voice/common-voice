import { Localized } from 'fluent-react';
import * as React from 'react';
import { Recordings } from '../../../../stores/recordings';
import { PlayIcon, RedoIcon, ShareIcon, StopIcon } from '../../../ui/icons';
import { ContributionPillProps } from '../contribution';
import Pill, { PillStatus } from '../pill';

import './recording-pill.css';

interface Props extends ContributionPillProps {
  clip: Recordings.SentenceRecording;
  status: PillStatus;
}

interface State {
  isPlaying: boolean;
}

export default class RecordingPill extends React.Component<Props, State> {
  audioRef = React.createRef<HTMLAudioElement>();

  state = { isPlaying: false };

  toggleIsPlaying = () => {
    const { current: audio } = this.audioRef;
    const isPlaying = !this.state.isPlaying;
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
    this.setState({ isPlaying });
  };

  render() {
    const { clip, status, ...props } = this.props;
    return (
      <Pill {...props} className="recording" status={status}>
        {status === 'active' && (
          <Localized id="record-cta">
            <div className="text" />
          </Localized>
        )}

        {status === 'done' && (
          <React.Fragment>
            <audio
              src={clip.recording.url}
              preload="auto"
              onEnded={this.toggleIsPlaying}
              ref={this.audioRef}
            />
            {this.state.isPlaying ? (
              <button type="button" onClick={this.toggleIsPlaying}>
                <StopIcon />
              </button>
            ) : (
              <React.Fragment>
                <button type="button" onClick={this.toggleIsPlaying}>
                  <PlayIcon />
                </button>
                <button type="button">
                  <RedoIcon />
                </button>
                <button type="button">
                  <ShareIcon />
                </button>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </Pill>
    );
  }
}
