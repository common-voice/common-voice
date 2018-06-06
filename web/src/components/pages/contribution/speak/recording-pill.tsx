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
  showSentenceTooltip: boolean;
}

class RecordingPill extends React.Component<Props, State> {
  audioRef = React.createRef<HTMLAudioElement>();

  state = { isPlaying: false, showSentenceTooltip: false };

  private toggleIsPlaying = () => {
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

  private showSentenceTooltip = () =>
    this.setState({ showSentenceTooltip: true });
  private hideSentenceTooltip = () =>
    this.setState({ showSentenceTooltip: false });

  render() {
    const {
      children,
      clip,
      getString,
      onRerecord,
      onShare,
      status,
      ...props
    } = this.props;
    const { isPlaying, showSentenceTooltip } = this.state;
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
                open={isPlaying || showSentenceTooltip}
                theme="grey-tooltip"
                title={clip.sentence.text}>
                <button
                  className="play"
                  type="button"
                  onClick={this.toggleIsPlaying}
                  onMouseEnter={this.showSentenceTooltip}
                  onMouseLeave={this.hideSentenceTooltip}>
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
}

export default withLocalization(RecordingPill);
