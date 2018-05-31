import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
const { Tooltip } = require('react-tippy');
import { Recordings } from '../../../../stores/recordings';
import {
  PlayOutlineIcon,
  RedoIcon,
  ShareIcon,
  StopIcon,
} from '../../../ui/icons';
import { ContributionPillProps } from '../contribution';
import Pill, { PillStatus } from '../pill';

import './recording-pill.css';

interface Props extends ContributionPillProps, LocalizationProps {
  clip: Recordings.SentenceRecording;
  onRerecord: () => any;
  status: PillStatus;
}

interface State {
  isPlaying: boolean;
}

class RecordingPill extends React.Component<Props, State> {
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
    const { clip, getString, onRerecord, status, ...props } = this.props;
    return (
      <Pill {...props} className="recording" openable status={status}>
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
              <button
                className="play"
                type="button"
                onClick={this.toggleIsPlaying}>
                <StopIcon />
              </button>
            ) : (
              <React.Fragment>
                <button
                  className="play"
                  type="button"
                  onClick={this.toggleIsPlaying}>
                  <PlayOutlineIcon />
                </button>
                <Tooltip arrow title={getString('review-tooltip')}>
                  <button className="redo" type="button" onClick={onRerecord}>
                    <RedoIcon />
                  </button>
                </Tooltip>
                <button className="share" type="button">
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

export default withLocalization(RecordingPill);
