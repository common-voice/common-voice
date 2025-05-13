import {
  Localized,
  withLocalization,
  WithLocalizationProps,
} from '@fluent/react'
import * as React from 'react'

import { connect } from 'react-redux'
import { Tooltip } from 'react-tippy'
import { Flags } from '../../../../stores/flags'
import { Locale } from '../../../../stores/locale'
import StateTree from '../../../../stores/tree'
import { User } from '../../../../stores/user'
import { Sentence } from 'common'
import {
  trackListening,
  trackRecording,
  getTrackClass,
} from '../../../../services/tracker'
import URLS from '../../../../urls'
import { LocaleLink } from '../../../locale-helpers'
import Modal from '../../../modal/modal'
import { KeyboardIcon, QuestionIcon } from '../../../ui/icons'

import { Button, LabeledCheckbox, LinkButton } from '../../../ui/ui'
import { PrimaryButton } from '../../../primary-buttons/primary-buttons'
import ShareModal from '../../../share-modal/share-modal'
import { ReportModal, ReportModalProps } from '../report/report'
import Wave from '../wave'
import { Notifications } from '../../../../stores/notifications'

import Success from '../success'

import './variant-recognition.css'

export const SET_COUNT = 5

export interface ContributionPillProps {
  isOpen: boolean
  key: any
  num: number
  onClick: () => any
  onShare: () => any
  style?: any
}

interface PropsFromState {
  flags: Flags.State
  locale: Locale.State
  user: User.State
}

interface PropsFromDispatch {
  addNotification: typeof Notifications.actions.addPill
}

export interface ContributionPageProps
  extends WithLocalizationProps,
    PropsFromState,
    PropsFromDispatch {
  activeIndex: number
  hasErrors: boolean
  errorContent?: React.ReactNode
  reportModalProps: Omit<ReportModalProps, 'onSubmitted' | 'getString'>
  instruction: (props: {
    vars: { actionType: string }
    children: any
  }) => React.ReactNode
  isFirstSubmit?: boolean
  isPlaying: boolean
  isSubmitted?: boolean
  isClicked?: boolean
  onReset: () => any
  onSkip?: () => any
  onNext?: () => any
  onSubmit?: (evt?: React.SyntheticEvent) => void
  onPrivacyAgreedChange?: (privacyAgreed: boolean) => void
  privacyAgreedChecked?: boolean
  shouldShowFirstCTA?: boolean
  shouldShowSecondCTA?: boolean

  primaryButtons: React.ReactNode
  pills: ((props: ContributionPillProps) => React.ReactNode)[]
  sentences: Sentence[]
  shortcuts: {
    key: string
    label: string
    icon?: React.ReactNode
    action: () => any
  }[]
  type: 'speak' | 'listen' | 'variant'
  userVariant?: string
}

interface State {
  selectedPill: number
  showReportModal: boolean
  showShareModal: boolean
  showShortcutsModal: boolean
  isMobile: boolean
}

class ContributionPage extends React.Component<ContributionPageProps, State> {
  static defaultProps = {
    isFirstSubmit: false,
  }

  state: State = {
    selectedPill: null,
    showReportModal: false,
    showShareModal: false,
    showShortcutsModal: false,
    isMobile: false,
  }

  private canvasRef: { current: HTMLCanvasElement | null } = React.createRef()
  private wave: Wave

  componentDidMount() {
    this.startWaving()
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('resize', this.detectMobile)
    this.detectMobile()
  }

  componentDidUpdate() {
    this.startWaving()

    const { isPlaying } = this.props

    if (this.wave) {
      isPlaying ? this.wave.play() : this.wave.idle()
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('resize', this.detectMobile)

    if (this.wave) this.wave.idle()
  }

  private get isLoaded() {
    return this.props.sentences.length > 0
  }

  private get isDone() {
    return this.isLoaded && this.props.activeIndex === -1
  }

  private get shortcuts() {
    return this.props.shortcuts
  }

  private startWaving = () => {
    const canvas = this.canvasRef.current

    if (this.wave) {
      if (!canvas) {
        this.wave.idle()
        this.wave = null
      }
      return
    }

    if (canvas) {
      this.wave = new Wave(canvas)
    }
  }

  private selectPill(i: number) {
    this.setState({ selectedPill: i })
  }

  private toggleShareModal = () =>
    this.setState({ showShareModal: !this.state.showShareModal })

  private toggleShortcutsModal = () => {
    const showShortcutsModal = !this.state.showShortcutsModal
    if (showShortcutsModal) {
      const { locale, type } = this.props
      ;(type == 'listen' ? trackListening : (trackRecording as any))(
        'view-shortcuts',
        locale
      )
    }
    return this.setState({ showShortcutsModal })
  }

  private handleKeyDown = (event: any) => {
    const { getString, isSubmitted, locale, onReset, onSubmit, type } =
      this.props

    if (
      event.ctrlKey ||
      event.altKey ||
      event.shiftKey ||
      event.metaKey ||
      this.state.showReportModal ||
      this.props.shouldShowFirstCTA
    ) {
      return
    }

    const isEnter = event.key === 'Enter'
    if (isSubmitted && isEnter) {
      onReset()
      return
    }
    if (this.isDone) {
      if (isEnter && onSubmit) onSubmit()
      return
    }

    const shortcut = this.shortcuts.find(
      ({ key }) => getString(key).toLowerCase() === event.key
    )
    if (!shortcut) return

    shortcut.action()
    ;((type === 'listen' ? trackListening : trackRecording) as any)(
      'shortcut',
      locale
    )
    event.preventDefault()
  }
  private detectMobile = () => {
    const isMobile = window.innerWidth <= 768
    this.setState({ isMobile })
  }

  render() {
    const {
      getString,
      onSkip,
      reportModalProps,
      type,
      shouldShowFirstCTA,
      shouldShowSecondCTA,
      user,
    } = this.props
    const { showReportModal, showShareModal, showShortcutsModal } = this.state

    return (
      <div className="contribution-wrapper" data-testid="contribution-page">
        {showShareModal && (
          <ShareModal onRequestClose={this.toggleShareModal} />
        )}
        {showShortcutsModal && (
          <Modal
            innerClassName="shortcuts-modal"
            onRequestClose={this.toggleShortcutsModal}>
            <Localized id="shortcuts">
              <h1 />
            </Localized>
            <div className="shortcuts">
              {this.shortcuts.map(({ key, label, icon }) => (
                <div key={key} className="shortcut">
                  <kbd title={getString(key).toUpperCase()}>
                    {icon ? icon : getString(key).toUpperCase()}
                  </kbd>
                  <div className="label">{getString(label)}</div>
                </div>
              ))}
            </div>
          </Modal>
        )}
        {showReportModal && (
          <ReportModal
            onRequestClose={() => this.setState({ showReportModal: false })}
            onSubmitted={onSkip}
            {...reportModalProps}
          />
        )}
        <div className={['contribution', type].join(' ')}>
          <div className="top">
            <div className="mobile-break" />
          </div>
          {this.renderContent()}
        </div>
      </div>
    )
  }

  renderClipCount() {
    const { activeIndex, isSubmitted } = this.props
    return (
      (isSubmitted ? SET_COUNT : activeIndex + 1 || SET_COUNT) + '/' + SET_COUNT
    )
  }

  renderContent() {
    const {
      activeIndex,
      hasErrors,
      errorContent,
      getString,
      instruction,
      isSubmitted,
      onReset,
      onSkip,
      onNext,
      onSubmit,
      pills,
      primaryButtons,
      sentences,
      type,
      onPrivacyAgreedChange,
      privacyAgreedChecked,
      shouldShowFirstCTA,
      shouldShowSecondCTA,
      user,
      isClicked,
      userVariant,
    } = this.props
    const { selectedPill } = this.state

    const noUserAccount = !user.account

    if (isSubmitted && noUserAccount) {
      return <Success onReset={onReset} type={type} userVariant={userVariant} />
    }

    const shouldShowCTA = shouldShowFirstCTA || shouldShowSecondCTA
    const shouldHideCTA = !shouldShowFirstCTA && !shouldShowSecondCTA

    const handlePrivacyAgreedChange = (
      evt: React.ChangeEvent<HTMLInputElement>
    ) => {
      onPrivacyAgreedChange(evt.target.checked)
    }

    if (hasErrors) {
      return errorContent
    }

    if (!this.isLoaded) {
      return null
    }
    const { isMobile } = this.state
    return (
      <>
        <div className="cards-and-pills">
          <div />

          {!isMobile && (
            <>
              <div className="cards-and-instruction">
                {instruction({
                  vars: { actionType: getString('action-click') },
                  children: (
                    <div className="instruction " data-testid="instruction" />
                  ),
                }) || <div className="instruction " />}

                <div className="cards-container">
                  <div className="cards">
                    {sentences.map((sentence, i) => {
                      const activeSentenceIndex = this.isDone
                        ? SET_COUNT - 1
                        : activeIndex
                      const isActive = i === activeSentenceIndex
                      return (
                        <div
                          translate="no"
                          key={sentence ? sentence.text : i}
                          className={
                            'card card-dimensions ' +
                            (isActive ? '' : 'inactive')
                          }
                          style={{
                            transform: [
                              `scale(${isActive ? 1 : 0.9})`,
                              `translateX(${
                                (document.dir == 'rtl' ? -1 : 1) *
                                (i - activeSentenceIndex) *
                                -130
                              }%)`,
                            ].join(' '),
                            opacity: i < activeSentenceIndex ? 0 : 1,
                          }}
                          data-testid={`card-${i + 1}`}>
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                            }}>
                            {sentence?.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="primary-buttons">{primaryButtons}</div>
                </div>
              </div>
              <div className="pills">
                <div className="inner">
                  {this.isDone && (
                    <div className="review-instructions">
                      <Localized id="review-instruction">
                        <span />
                      </Localized>
                    </div>
                  )}
                  {pills.map((pill, i) =>
                    pill({
                      isOpen: this.isDone || selectedPill === i,
                      key: i,
                      num: i + 1,
                      onClick: () => this.selectPill(i),
                      onShare: this.toggleShareModal,
                      style:
                        selectedPill !== null &&
                        Math.abs(
                          Math.min(
                            Math.max(selectedPill, 1),
                            pills.length - 2
                          ) - i
                        ) > 1
                          ? { display: 'none' }
                          : {},
                    })
                  )}
                </div>
              </div>
            </>
          )}

          {isMobile && (
            <>
              <div className="cards-and-instruction">
                {instruction({
                  vars: { actionType: getString('action-click') },
                  children: (
                    <div className="instruction " data-testid="instruction" />
                  ),
                }) || <div className="instruction " />}

                <div className="cards-container">
                  <div className="cards">
                    {sentences.map((sentence, i) => {
                      const activeSentenceIndex = this.isDone
                        ? SET_COUNT - 1
                        : activeIndex
                      const isActive = i === activeSentenceIndex
                      return (
                        <div
                          translate="no"
                          key={sentence ? sentence.text : i}
                          className={
                            'card card-dimensions ' +
                            (isActive ? '' : 'inactive')
                          }
                          style={{
                            transform: [
                              `scale(${isActive ? 1 : 0.9})`,
                              `translateX(${
                                (document.dir == 'rtl' ? -1 : 1) *
                                (i - activeSentenceIndex) *
                                -130
                              }%)`,
                            ].join(' '),
                            opacity: i < activeSentenceIndex ? 0 : 1,
                          }}
                          data-testid={`card-${i + 1}`}>
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'space-evenly',
                            }}>
                            {sentence?.text}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="pills">
                <div className="inner">
                  {this.isDone && (
                    <div className="review-instructions">
                      <Localized id="review-instruction">
                        <span />
                      </Localized>
                    </div>
                  )}
                  {pills.map((pill, i) =>
                    pill({
                      isOpen: this.isDone || selectedPill === i,
                      key: i,
                      num: i + 1,
                      onClick: () => this.selectPill(i),
                      onShare: this.toggleShareModal,
                      style:
                        selectedPill !== null &&
                        Math.abs(
                          Math.min(
                            Math.max(selectedPill, 1),
                            pills.length - 2
                          ) - i
                        ) > 1
                          ? { display: 'none' }
                          : {},
                    })
                  )}
                </div>
              </div>
              <div className="primary-buttons">{primaryButtons}</div>
            </>
          )}
        </div>
        <div className="buttons">
          <div>
            <LinkButton
              rounded
              outline
              className="guidelines-button"
              blank
              to={URLS.GUIDELINES}>
              <QuestionIcon />
              <Localized id="guidelines">
                <span />
              </Localized>
            </LinkButton>
            <div className="extra-buttons">
              <Tooltip title="Shortcuts" arrow>
                <Button
                  rounded
                  outline
                  className="hidden-md-down shortcuts-btn"
                  onClick={this.toggleShortcutsModal}>
                  <KeyboardIcon />
                </Button>
              </Tooltip>
            </div>
          </div>
          <div>
            <Localized id="next-button">
              <PrimaryButton
                className={['next', getTrackClass('fs', `submit-${type}`)].join(
                  ' '
                )}
                disabled={!isClicked}
                onClick={onNext}
                type="submit"
                data-testid="submit-button"
              />
            </Localized>

            {onSubmit && shouldHideCTA && (
              <form
                onSubmit={onSubmit}
                className="contribution-speak-form"
                data-testid="speak-submit-form">
                {this.isDone && !user.privacyAgreed && (
                  <LabeledCheckbox
                    label={
                      <Localized
                        id="accept-privacy-and-terms"
                        elems={{
                          termsLink: <LocaleLink to={URLS.TERMS} blank />,
                          privacyLink: <LocaleLink to={URLS.PRIVACY} blank />,
                        }}>
                        <span />
                      </Localized>
                    }
                    required
                    onChange={handlePrivacyAgreedChange}
                    checked={privacyAgreedChecked}
                    data-testid="checkbox"
                  />
                )}
                <Localized id="submit-form-action">
                  <PrimaryButton
                    className={[
                      'submit',
                      getTrackClass('fs', `submit-${type}`),
                    ].join(' ')}
                    disabled={!this.isDone}
                    type="submit"
                    data-testid="submit-button"
                  />
                </Localized>
              </form>
            )}
          </div>
        </div>
      </>
    )
  }
}

export default connect<PropsFromState, PropsFromDispatch>(
  ({ flags, locale, user }: StateTree) => ({
    flags,
    locale,
    user,
  }),
  {
    addNotification: Notifications.actions.addPill,
  }
)(withLocalization(ContributionPage))
