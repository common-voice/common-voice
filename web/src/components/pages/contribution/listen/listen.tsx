import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { Clip as ClipType } from 'common';
import { trackListening, getTrackClass } from '../../../../services/tracker';
import { Clips } from '../../../../stores/clips';
import { Locale } from '../../../../stores/locale';
import StateTree from '../../../../stores/tree';
import API from '../../../../services/api';
import URLS from '../../../../urls';
import {
  CheckIcon,
  CrossIcon,
  MicIcon,
  OldPlayIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  VolumeIcon,
} from '../../../ui/icons';
import { LinkButton } from '../../../ui/ui';
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution';
import { Notifications } from '../../../../stores/notifications';
import { PlayButton } from '../../../primary-buttons/primary-buttons';
import Pill from '../pill';

import './listen.css';
import { User } from '@sentry/types';

const VOTE_NO_PLAY_MS = 3000; // Threshold when to allow voting no

const VoteButton = ({
  kind,
  ...props
}: { kind: 'yes' | 'no' } & React.ButtonHTMLAttributes<any>) => (
  <button
    type="button"
    className={['vote-button', kind, getTrackClass('fs', `vote-${kind}`)].join(
      ' '
    )}
    {...props}>
    {kind === 'yes' && <ThumbsUpIcon />}
    {kind === 'no' && <ThumbsDownIcon />}
    <Localized id={'vote-' + kind}>
      <span />
    </Localized>
  </button>
);

interface PropsFromState {
  api: API;
  clips: ClipType[];
  isLoading: boolean;
  locale: Locale.State;
  showFirstContributionToast: boolean;
  hasEarnedSessionToast: boolean;
  showFirstStreakToast: boolean;
  challengeEnded: boolean;
}

interface PropsFromDispatch {
  removeClip: typeof Clips.actions.remove;
  vote: typeof Clips.actions.vote;
  addAchievement: typeof Notifications.actions.addAchievement;
}

interface Props extends PropsFromState, PropsFromDispatch {}

interface State {
  clips: (ClipType & { isValid?: boolean })[];
  hasPlayed: boolean;
  hasPlayedSome: boolean;
  isPlaying: boolean;
  isSubmitted: boolean;
}

const initialState: State = {
  clips: [],
  hasPlayed: false,
  hasPlayedSome: false,
  isPlaying: false,
  isSubmitted: false,
};

class ListenPage extends React.Component<Props, State> {
  audioRef = React.createRef<HTMLAudioElement>();
  playedSomeInterval: any;

  state: State = initialState;

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
    // this.audioPlayer.close();
  }

  private getClipIndex() {
    return this.state.clips.findIndex(clip => clip.isValid === null);
  }

  private play = () => {
    if (this.state.isPlaying) {
      this.stop();
      return;
    }

    this.audioRef.current.play();
    this.setState({ isPlaying: true });
    clearInterval(this.playedSomeInterval);
    this.playedSomeInterval = setInterval(
      () => this.setState({ hasPlayedSome: true }),
      VOTE_NO_PLAY_MS
    );
  };

  private stop = () => {
    const audio = this.audioRef.current;
    audio.pause();
    audio.currentTime = 0;
    clearInterval(this.playedSomeInterval);
    this.setState({ isPlaying: false });
  };

  private hasPlayed = () => {
    this.setState({ hasPlayed: true, isPlaying: false });
    trackListening('listen', this.props.locale);
  };

  private vote = (isValid: boolean) => {
    const { clips } = this.state;

    const {
      showFirstContributionToast,
      hasEarnedSessionToast,
      addAchievement,
      api,
      showFirstStreakToast,
      challengeEnded,
    } = this.props;
    const clipIndex = this.getClipIndex();

    this.stop();
    this.props.vote(isValid, this.state.clips[this.getClipIndex()].id);

    sessionStorage.setItem('challengeEnded', JSON.stringify(challengeEnded));
    sessionStorage.setItem('hasContributed', 'true');

    if (showFirstContributionToast) {
      addAchievement(
        50,
        "You're on your way! Congrats on your first contribution.",
        'success'
      );
    }
    if (showFirstStreakToast) {
      addAchievement(
        50,
        'You completed a three-day streak! Keep it up.',
        'success'
      );
    }
    if (
      !JSON.parse(sessionStorage.getItem('challengeEnded')) &&
      JSON.parse(sessionStorage.getItem('hasShared')) &&
      !hasEarnedSessionToast
    ) {
      addAchievement(
        50,
        "You're on a roll! You sent an invite and contributed in the same session.",
        'success'
      );
      sessionStorage.removeItem('hasShared');
      // Tell back-end user get unexpected achievement: invite + contribute in the same session
      // Each user can only get once.
      api.setInviteContributeAchievement();
    }
    this.setState({
      hasPlayed: false,
      hasPlayedSome: false,
      isPlaying: false,
      isSubmitted: clipIndex === SET_COUNT - 1,
      clips: clips.map((clip, i) =>
        i === clipIndex ? { ...clip, isValid } : clip
      ),
    });
  };

  private voteYes = () => {
    if (!this.state.hasPlayed) {
      return;
    }
    this.vote(true);
    trackListening('vote-yes', this.props.locale);
  };

  private voteNo = () => {
    const { hasPlayed, hasPlayedSome } = this.state;
    if (!hasPlayed && !hasPlayedSome) {
      return;
    }
    this.vote(false);
    trackListening('vote-no', this.props.locale);
  };

  private handleSkip = () => {
    const { removeClip } = this.props;
    const { clips } = this.state;
    this.stop();
    removeClip(clips[this.getClipIndex()].id);
    this.setState({
      clips: clips.map((clip, i) =>
        this.getClipIndex() === i
          ? { ...this.props.clips.slice(SET_COUNT)[0], isValid: null }
          : clip
      ),
      hasPlayed: false,
      hasPlayedSome: false,
    });
  };

  private reset = () => this.setState(initialState);

  render() {
    const {
      clips,
      hasPlayed,
      hasPlayedSome,
      isPlaying,
      isSubmitted,
    } = this.state;
    const clipIndex = this.getClipIndex();
    const activeClip = clips[clipIndex];
    return (
      <>
        <audio
          {...(activeClip && { src: activeClip.audioSrc })}
          preload="auto"
          onEnded={this.hasPlayed}
          ref={this.audioRef}
        />
        <ContributionPage
          activeIndex={clipIndex}
          errorContent={
            !this.props.isLoading &&
            (clips.length === 0 || !activeClip) && (
              <div className="empty-container">
                <div className="error-card card-dimensions">
                  <Localized id="listen-empty-state">
                    <span />
                  </Localized>
                  <LinkButton
                    rounded
                    to={URLS.SPEAK}
                    className="record-instead">
                    <MicIcon />{' '}
                    <Localized id="record-button-label">
                      <span />
                    </Localized>
                  </LinkButton>
                </div>
              </div>
            )
          }
          instruction={props =>
            activeClip &&
            !isPlaying &&
            !hasPlayedSome &&
            !hasPlayed && (
              <Localized
                id={
                  clipIndex === SET_COUNT - 1
                    ? 'listen-last-time-instruction'
                    : [
                        'listen-instruction',
                        'listen-again-instruction',
                        'listen-3rd-time-instruction',
                      ][clipIndex] || 'listen-again-instruction'
                }
                playIcon={<OldPlayIcon />}
                {...props}
              />
            )
          }
          isPlaying={isPlaying}
          isSubmitted={isSubmitted}
          onReset={this.reset}
          onSkip={this.handleSkip}
          primaryButtons={
            <>
              <VoteButton
                kind="yes"
                onClick={this.voteYes}
                disabled={!hasPlayed}
              />
              <PlayButton
                isPlaying={isPlaying}
                onClick={this.play}
                trackClass="play-clip"
              />
              <VoteButton
                kind="no"
                onClick={this.voteNo}
                disabled={!hasPlayed && !hasPlayedSome}
              />
            </>
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
          reportModalProps={{
            reasons: [
              'offensive-speech',
              'grammar-or-spelling',
              'different-language',
            ],
            kind: 'clip',
            id: activeClip ? activeClip.id : null,
          }}
          sentences={clips.map(clip => clip.sentence)}
          shortcuts={[
            {
              key: 'shortcut-play-toggle',
              label: 'shortcut-play-toggle-label',
              action: this.play,
            },
            {
              key: 'shortcut-vote-yes',
              label: 'vote-yes',
              action: this.voteYes,
            },
            {
              key: 'shortcut-vote-no',
              label: 'vote-no',
              action: this.voteNo,
            },
          ]}
          type="listen"
        />
      </>
    );
  }
}

const mapStateToProps = (state: StateTree) => {
  const {
    clips,
    isLoading,
    showFirstContributionToast,
    hasEarnedSessionToast,
    showFirstStreakToast,
    challengeEnded,
  } = Clips.selectors.localeClips(state);
  const { api } = state;
  return {
    clips,
    isLoading,
    showFirstContributionToast,
    hasEarnedSessionToast,
    showFirstStreakToast,
    challengeEnded,
    api,
    locale: state.locale,
  };
};

const mapDispatchToProps = {
  removeClip: Clips.actions.remove,
  vote: Clips.actions.vote,
  addAchievement: Notifications.actions.addAchievement,
};

export default connect<PropsFromState, any>(
  mapStateToProps,
  mapDispatchToProps
)(ListenPage);
