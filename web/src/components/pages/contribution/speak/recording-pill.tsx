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
  children?: React.ReactNode;
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
    const {
      children,
      clip,
      getString,
      onRerecord,
      status,
      ...props
    } = this.props;
    const { isPlaying } = this.state;
    return (
      <Pill {...props} className="recording" openable status={status}>
        {children}

        {!children &&
          status === 'active' && (
            <Localized id="record-cta">
              <div className="text" />
            </Localized>
          )}

        {!children &&
          status === 'done' && (
            <React.Fragment>
              <audio
                src={clip.recording.url}
                preload="auto"
                onEnded={this.toggleIsPlaying}
                ref={this.audioRef}
              />
              <Tooltip
                arrow
                open={isPlaying}
                theme="grey-tooltip"
                title={clip.sentence.text}>
                <button
                  className="play"
                  type="button"
                  onClick={this.toggleIsPlaying}>
                  {isPlaying ? <StopIcon /> : <PlayOutlineIcon />}
                </button>
              </Tooltip>
              {isPlaying ? (
                <div className="placeholder" />
              ) : (
                <React.Fragment>
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
