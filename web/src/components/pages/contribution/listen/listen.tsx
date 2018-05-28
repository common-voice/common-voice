import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { trackListening } from '../../../../services/tracker';
import { Clips } from '../../../../stores/clips';
import StateTree from '../../../../stores/tree';
import { User } from '../../../../stores/user';
import {
  CheckIcon,
  CrossIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  VolumeIcon,
} from '../../../ui/icons';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import { PlayButton } from '../primary-buttons';
import Pill from '../pill';

import './listen.css';

const VOTE_NO_PLAY_MS = 3000; // Threshold when to allow voting no

const VoteButton = ({
  type,
  ...props
}: { type: 'yes' | 'no' } & React.ButtonHTMLAttributes<any>) => (
  <button type="button" className={['vote-button', type].join(' ')} {...props}>
    {type === 'yes' && <ThumbsUpIcon />}
    {type === 'no' && <ThumbsDownIcon />}
    <Localized id={'vote-' + type}>
      <span />
    </Localized>
  </button>
);

interface PropsFromState {
  clips: Clips.Clip[];
}

interface PropsFromDispatch {
  removeClip: typeof Clips.actions.remove;
  tallyVerification: typeof User.actions.tallyVerification;
  vote: typeof Clips.actions.vote;
}

interface Props extends PropsFromState, PropsFromDispatch {}

interface State {
  clips: (Clips.Clip & { isValid?: boolean })[];
  hasPlayed: boolean;
  hasPlayedSome: boolean;
  isPlaying: boolean;
}

class ListenPage extends React.Component<Props, State> {
  audioRef = React.createRef<HTMLAudioElement>();
  playedSomeInterval: any;

  state: State = {
    clips: [],
    hasPlayed: false,
    hasPlayedSome: false,
    isPlaying: false,
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.clips.length > 0) return null;

    if (props.clips.length > 0) {
      return {
        clips: props.clips
          .slice(0, SET_COUNT)
          .map(clip => ({ ...clip, isValid: null })),
      };
    }

    return null;
  }

  componentWillUnmount() {
    clearInterval(this.playedSomeInterval);
  }

  private getClipIndex() {
    return this.state.clips.findIndex(clip => clip.isValid === null);
  }

  private play = () => {
    const audio = this.audioRef.current;
    if (this.state.isPlaying) {
      audio.pause();
      audio.currentTime = 0;
      clearInterval(this.playedSomeInterval);
      this.setState({ isPlaying: false });
      return;
    }

    audio.play();
    this.setState({ isPlaying: true });
    clearInterval(this.playedSomeInterval);
    this.playedSomeInterval = setInterval(
      () => this.setState({ hasPlayedSome: true }),
      VOTE_NO_PLAY_MS
    );
  };

  private hasPlayed = () => {
    this.setState({ hasPlayed: true, isPlaying: false });
    trackListening('listen');
  };

  private vote = (isValid: boolean) => {
    const { clips } = this.state;
    const clipIndex = this.getClipIndex();

    clearInterval(this.playedSomeInterval);
    this.setState({
      hasPlayed: false,
      hasPlayedSome: false,
      isPlaying: false,
      clips: clips.map(
        (clip, i) => (i === clipIndex ? { ...clip, isValid } : clip)
      ),
    });

    this.props.vote(isValid, this.state.clips[this.getClipIndex()].id);
  };

  private voteYes = () => {
    if (!this.state.hasPlayed) {
      return;
    }
    this.vote(true);
    trackListening('vote-yes');
  };

  private voteNo = () => {
    const { hasPlayed, hasPlayedSome } = this.state;
    if (!hasPlayed && !hasPlayedSome) {
      return;
    }
    this.vote(false);
    trackListening('vote-no');
  };

  private handleSkip = () => {
    const { removeClip } = this.props;
    const { clips } = this.state;
    removeClip(clips[this.getClipIndex()].id);
    this.setState({
      clips: clips.map(
        (clip, i) =>
          this.getClipIndex() === i
            ? { ...this.props.clips.slice(SET_COUNT)[0], isValid: null }
            : clip
      ),
    });
  };

  render() {
    const { clips, hasPlayed, hasPlayedSome, isPlaying } = this.state;
    const clipIndex = this.getClipIndex();
    const activeClip = clips[clipIndex];
    return (
      <React.Fragment>
        <audio
          {...activeClip && { src: activeClip.audioSrc }}
          preload="auto"
          onEnded={this.hasPlayed}
          ref={this.audioRef}
        />
        <ContributionPage
          activeIndex={clipIndex}
          className="listen"
          instruction={props => (
            <Localized id="record-instruction" {...props} />
          )}
          onSkip={this.handleSkip}
          primaryButtons={
            <React.Fragment>
              {hasPlayed ? (
                <VoteButton type="yes" onClick={this.voteYes} />
              ) : (
                <div className="vote-button-placeholder" />
              )}
              <PlayButton isPlaying={isPlaying} onClick={this.play} />
              {hasPlayed || hasPlayedSome ? (
                <VoteButton type="no" onClick={this.voteNo} />
              ) : (
                <div className="vote-button-placeholder" />
              )}
            </React.Fragment>
          }
          pills={clips.map(
            ({ isValid }, i) => (props: ContributionPillProps) => {
              const isVoted = isValid !== null;
              const isActive = clipIndex === i;
              return (
                <Pill
                  className={isVoted ? (isValid ? 'valid' : 'invalid') : ''}
                  onClick={null}
                  status={isActive ? 'active' : isVoted ? 'done' : 'pending'}
                  {...props}>
                  {isActive ? (
                    <VolumeIcon />
                  ) : isVoted ? (
                    isValid ? (
                      <CheckIcon />
                    ) : (
                      <CrossIcon />
                    )
                  ) : null}
                </Pill>
              );
            }
          )}
          sentences={clips.map(clip => clip.sentence)}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  return {
    clips: Clips.selectors.localeClips(state).clips,
  };
};

const mapDispatchToProps = {
  removeClip: Clips.actions.remove,
  tallyVerification: User.actions.tallyVerification,
  vote: Clips.actions.vote,
};

export default connect<PropsFromState, PropsFromDispatch>(
  mapStateToProps,
  mapDispatchToProps
)(ListenPage);
