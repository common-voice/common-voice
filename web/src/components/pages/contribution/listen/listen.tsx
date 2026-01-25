import { Localized } from '@fluent/react'
import * as React from 'react'
import { connect } from 'react-redux'
import { RouteComponentProps, withRouter } from 'react-router'
import NavigationPrompt from 'react-router-navigation-prompt'

import { Clip as ClipType } from 'common'
import { getTrackClass } from '../../../../services/tracker'
import { Clips } from '../../../../stores/clips'
import { Locale } from '../../../../stores/locale'
import { User } from '../../../../stores/user'
import {
  AbortContributionModalActions,
  AbortContributionModalStatus,
} from '../../../../stores/abort-contribution-modal'
import StateTree from '../../../../stores/tree'
import API from '../../../../services/api'
import URLS from '../../../../urls'
import {
  CheckIcon,
  CrossIcon,
  OldPlayIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  VolumeIcon,
} from '../../../ui/icons'
import { Button, Spinner } from '../../../ui/ui'
import ContributionPage, {
  ContributionPillProps,
  SET_COUNT,
} from '../contribution'
import { Notifications } from '../../../../stores/notifications'
import { PlayButton } from '../../../primary-buttons/primary-buttons'
import Pill from '../pill'
import ListenErrorContent from './listen-error-content'
import Modal, { ModalButtons } from '../../../modal/modal'
import { trackGtag } from '../../../../services/tracker-ga4'

import './listen.css'

const VOTE_NO_PLAY_MS = 3000 // Threshold when to allow voting no

export const VoteButton = ({
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
)

interface PropsFromState {
  api: API
  clips: ClipType[]
  isLoading: boolean
  hasLoadingError: boolean
  locale: Locale.State
  user: User.State
  showFirstContributionToast: boolean
  hasEarnedSessionToast: boolean
  showFirstStreakToast: boolean
  challengeEnded: boolean
}

interface PropsFromDispatch {
  loadClips: typeof Clips.actions.refillCache
  removeClip: typeof Clips.actions.remove
  vote: typeof Clips.actions.vote
  addAchievement: typeof Notifications.actions.addAchievement
  setAbortContributionModalVisible: typeof AbortContributionModalActions.setAbortContributionModalVisible
  setAbortStatus: typeof AbortContributionModalActions.setAbortStatus
}

interface Props
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps {}

interface State {
  clips: (ClipType & { isValid?: boolean })[]
  hasPlayed: boolean
  hasPlayedSome: boolean
  isPlaying: boolean
  isSubmitted: boolean
}

const initialState: State = {
  clips: [],
  hasPlayed: false,
  hasPlayedSome: false,
  isPlaying: false,
  isSubmitted: false,
}

class ListenPage extends React.Component<Props, State> {
  audioRef = React.createRef<HTMLAudioElement>()
  playedSomeInterval: any

  state: State = initialState
  demoMode = this.props.location.pathname.includes(URLS.DEMO)

  // try to disable double clicks/taps
  private playLockDurationMs = 600 // mobile devices already introduce ~300 ms lag
  private isPlayLocked = false

  static getDerivedStateFromProps(props: Props, state: State) {
    const unvalidatedClips = state.clips.filter(
      clip => clip.isValid === null
    ).length

    if (unvalidatedClips > 0) return null

    if (props.clips && props.clips.length > 0) {
      return {
        clips: props.clips
          .slice(0, SET_COUNT)
          .map(clip => ({ ...clip, isValid: null })),
      }
    }

    return null
  }

  componentDidMount(): void {
    const { loadClips } = this.props
    loadClips()
  }

  componentWillUnmount() {
    clearInterval(this.playedSomeInterval)
    // this.audioPlayer.close();
  }

  private getClipIndex() {
    return this.state.clips.findIndex(clip => clip.isValid === null)
  }

  private play = async () => {
    if (this.isPlayLocked) return // Prevent during lock period
    // if really playing, stop
    if (this.state.isPlaying) {
      this.stop()
      return
    }

    // No attached audio or failing audio (bad file/codec?)
    const audio = this.audioRef.current
    if (!audio) return

    // Set lock for 500ms
    this.isPlayLocked = true
    setTimeout(() => {
      this.isPlayLocked = false
    }, this.playLockDurationMs)

    try {
      // Reset current time if at the end
      if (audio.currentTime >= audio.duration) {
        audio.currentTime = 0
      }

      // Make sure the promise returns (playing starts)
      await audio.play()

      // Only update state if play() succeeded
      this.setState({ isPlaying: true })

      clearInterval(this.playedSomeInterval)
      this.playedSomeInterval = setInterval(
        () => this.setState({ hasPlayedSome: true }),
        VOTE_NO_PLAY_MS
      )
    } catch (error) {
      // Handle specific abort error silently, log others
      if (error.name !== 'AbortError') {
        console.error('Error playing audio:', error)
      }
      // Ensure state reflects actual playing status
      this.setState({ isPlaying: false })
    }
  }

  private stop = () => {
    if (this.state.isPlaying) {
      const audio = this.audioRef.current
      audio.pause()
      audio.currentTime = 0
      clearInterval(this.playedSomeInterval)
      this.setState({ isPlaying: false })
      this.isPlayLocked = false
    }
  }

  private hasPlayed = () => {
    this.setState({ hasPlayed: true, isPlaying: false })
    trackGtag('listen-clip', { locale: this.props.locale })
  }

  private vote = (isValid: boolean) => {
    const { clips } = this.state

    const {
      showFirstContributionToast,
      hasEarnedSessionToast,
      addAchievement,
      api,
      showFirstStreakToast,
      challengeEnded,
    } = this.props
    const clipIndex = this.getClipIndex()

    // Guard against invalid clip index
    if (clipIndex < 0 || clipIndex >= clips.length || !clips[clipIndex]) {
      console.error('Invalid clip index:', clipIndex)
      return
    }

    this.stop()
    this.props.vote(isValid, clips[clipIndex].id)

    try {
      sessionStorage.setItem('challengeEnded', JSON.stringify(challengeEnded))
      sessionStorage.setItem('hasContributed', 'true')
    } catch (e) {
      console.warn(`A sessionStorage error occurred ${e.message}`)
    }

    if (showFirstContributionToast) {
      addAchievement(
        50,
        "You're on your way! Congrats on your first contribution.",
        'success'
      )
    }
    if (showFirstStreakToast) {
      addAchievement(
        50,
        'You completed a three-day streak! Keep it up.',
        'success'
      )
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
      )
      sessionStorage.removeItem('hasShared')
      // Tell back-end user get unexpected achievement: invite + contribute in the same session
      // Each user can only get once.
      api.setInviteContributeAchievement()
    }
    this.setState({
      hasPlayed: false,
      hasPlayedSome: false,
      isPlaying: false,
      isSubmitted: clipIndex === SET_COUNT - 1,
      clips: clips.map((clip, i) =>
        i === clipIndex ? { ...clip, isValid } : clip
      ),
    })
  }

  private voteYes = () => {
    if (!this.state.hasPlayed) {
      return
    }
    this.vote(true)
    trackGtag('vote-yes', { locale: this.props.locale })
  }

  private voteNo = () => {
    const { hasPlayed, hasPlayedSome } = this.state
    if (!hasPlayed && !hasPlayedSome) {
      return
    }
    this.vote(false)
    trackGtag('vote-no', { locale: this.props.locale })
  }

  private handleSkip = async () => {
    const { removeClip, api } = this.props
    const { clips } = this.state
    const clipIndex = this.getClipIndex()

    // Guard against invalid clip index
    if (clipIndex < 0 || clipIndex >= clips.length || !clips[clipIndex]) {
      console.error('Invalid clip index for skip:', clipIndex)
      return
    }

    this.stop()
    const clipId = clips[clipIndex].id

    try {
      await api.skipClip(clipId)
      removeClip(clipId)

      trackGtag('skip-clip', { locale: this.props.locale })
    } catch (error) {
      console.error('Failed to skip clip:', error)
      // Even if API call fails, still remove from UI for better UX
      removeClip(clipId)
    }

    let replacementSet = [...clips]

    // If there's more in the cache, replace current clip with the next one from cache
    if (this.props.clips.length > SET_COUNT) {
      replacementSet[this.getClipIndex()] = {
        ...this.props.clips.slice(SET_COUNT)[0],
        isValid: null,
      }
    } else {
      // else, remove current clip and shift the remainder up
      replacementSet = [
        ...replacementSet.slice(0, this.getClipIndex()),
        ...replacementSet.slice(this.getClipIndex() + 1),
      ]
    }

    this.setState({
      clips: replacementSet,
      hasPlayed: false,
      hasPlayedSome: false,
    })
  }

  private reset = () => this.setState(initialState)

  private setAbortContributionModalVisiblity = (
    abortContributionModalVisibilty: boolean
  ) => {
    const { setAbortContributionModalVisible } = this.props
    setAbortContributionModalVisible(abortContributionModalVisibilty)
  }

  private handleAbortCancel = (onCancel: () => void) => {
    onCancel()
    this.props.setAbortStatus(AbortContributionModalStatus.REJECTED)
    this.setAbortContributionModalVisiblity(false)
  }

  private handleAbortConfirm = (onConfirm: () => void) => {
    onConfirm()
    this.props.setAbortStatus(AbortContributionModalStatus.CONFIRMED)
    this.setAbortContributionModalVisiblity(false)
  }

  render() {
    const { isLoading, hasLoadingError, user, locale } = this.props
    const { clips, hasPlayed, hasPlayedSome, isPlaying, isSubmitted } =
      this.state
    const clipIndex = this.getClipIndex()
    const activeClip = clipIndex >= 0 ? clips[clipIndex] : null
    const noClips = clips.length === 0
    const isMissingClips = !isLoading && (noClips || !activeClip)
    const currentLocale = user?.account?.languages.find(
      lang => lang.locale === locale
    )
    const isVariantPreferredOption = currentLocale?.variant?.is_preferred_option

    return (
      <>
        <div id="listen-page">
          {noClips && isLoading && <Spinner delayMs={500} />}
          {!isSubmitted && (
            <NavigationPrompt
              when={() => {
                // Only show warning if there are votes that haven't been submitted yet
                // After submission (isSubmitted=true), user can safely refresh
                const isUnvalidatedClips =
                  !isSubmitted && clips.some(clip => clip.isValid !== null)

                if (isUnvalidatedClips) {
                  this.setAbortContributionModalVisiblity(true)
                }
                return isUnvalidatedClips
              }}>
              {({ onCancel, onConfirm }) => {
                return (
                  <Modal
                    innerClassName="listen-abort"
                    onRequestClose={() => this.handleAbortCancel(onCancel)}>
                    <Localized id="listen-abort-title">
                      <h1 className="title" />
                    </Localized>
                    <Localized id="record-abort-text">
                      <p className="text" />
                    </Localized>
                    <ModalButtons>
                      <Localized id="listen-abort-cancel">
                        <Button
                          outline
                          rounded
                          onClick={() => this.handleAbortCancel(onCancel)}
                        />
                      </Localized>
                      <Localized id="listen-abort-confirm">
                        <Button
                          outline
                          rounded
                          onClick={() => this.handleAbortConfirm(onConfirm)}
                        />
                      </Localized>
                    </ModalButtons>
                  </Modal>
                )
              }}
            </NavigationPrompt>
          )}
          <audio
            {...(activeClip && { src: activeClip.audioSrc })}
            preload="auto"
            onEnded={this.hasPlayed}
            ref={this.audioRef}
          />
          <ContributionPage
            activeIndex={clipIndex}
            demoMode={this.demoMode}
            hasErrors={!isLoading && (isMissingClips || hasLoadingError)}
            errorContent={
              <ListenErrorContent
                isLoading={isLoading}
                hasLoadingError={hasLoadingError}
                isMissingClips={isMissingClips}
                isDemoMode={this.demoMode}
                isMissingClipsForVariant={
                  isMissingClips && isVariantPreferredOption
                }
              />
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
                  elems={{ playIcon: <OldPlayIcon /> }}
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
                  data-testid="vote-yes-button"
                />
                <PlayButton
                  isPlaying={isPlaying}
                  onClick={this.play}
                  trackClass="play-clip"
                  data-testid="play-button"
                />
                <VoteButton
                  kind="no"
                  onClick={this.voteNo}
                  disabled={!hasPlayed && !hasPlayedSome}
                  data-testid="vote-no-button"
                />
              </>
            }
            pills={(clips || []).map(
              ({ isValid }, i) =>
                (props: ContributionPillProps) => {
                  const isVoted = isValid !== null
                  const isActive = clipIndex === i
                  return (
                    <Pill
                      className={isVoted ? (isValid ? 'valid' : 'invalid') : ''}
                      onClick={null}
                      status={
                        isActive ? 'active' : isVoted ? 'done' : 'pending'
                      }
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
                  )
                }
            )}
            reportModalProps={{
              reasons: [
                'offensive-speech',
                'grammar-or-spelling',
                'different-language',
              ],
              kind: 'clip',
              id: activeClip?.id ?? null,
              locale,
            }}
            sentences={(clips || [])
              // Clip.sentence is always defined per type definition
              // Array length MUST match pills array for correct UI alignment
              .map(clip => clip.sentence)}
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
        </div>
      </>
    )
  }
}

const mapStateToProps = (state: StateTree) => {
  const {
    clips,
    isLoading,
    hasLoadingError,
    showFirstContributionToast,
    hasEarnedSessionToast,
    showFirstStreakToast,
    challengeEnded,
  } = Clips.selectors.localeClips(state)
  const { api } = state
  return {
    clips,
    isLoading,
    hasLoadingError,
    showFirstContributionToast,
    hasEarnedSessionToast,
    showFirstStreakToast,
    challengeEnded,
    api,
    locale: state.locale,
    user: state.user,
  }
}

const mapDispatchToProps = {
  loadClips: Clips.actions.refillCache,
  removeClip: Clips.actions.remove,
  vote: Clips.actions.vote,
  addAchievement: Notifications.actions.addAchievement,
  setAbortContributionModalVisible:
    AbortContributionModalActions.setAbortContributionModalVisible,
  setAbortStatus: AbortContributionModalActions.setAbortStatus,
}

export default connect<PropsFromState, any>(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ListenPage))
