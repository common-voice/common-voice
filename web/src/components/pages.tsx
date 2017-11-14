import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, RouteComponentProps, withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
import { getItunesURL, isNativeIOS, isIOS, isSafari } from '../utility';
import Modal from './modal/modal';
import ContactModal from './contact-modal/contact-modal';
import Logo from './logo';
import Icon from './icon';
import Robot from './robot';

import Home from './pages/home/home';
import Record from './pages/record/record';
import Profile from './pages/profile';
import FAQ from './pages/faq';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

import API from '../services/api';
import { actions, UserState } from '../stores/user';
import { apiSelector } from '../stores/root';

interface PageUrls {
  [key: string]: string;
  ROOT: string;
  RECORD: string;
  PROFILE: string;
  FAQ: string;
  PRIVACY: string;
  TERMS: string;
  NOTFOUND: string;
}

const URLS: PageUrls = {
  ROOT: '/',
  RECORD: '/record',
  PROFILE: '/profile',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found',
};

interface PropsFromState {
  api: API;
  user: UserState;
}

interface PropsFromDispatch {
  tallyRecording: typeof actions.tallyRecording;
  updateUser: typeof actions.update;
}

interface PagesProps
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface PagesState {
  isMenuVisible: boolean;
  scrolled: boolean;
  showContactModal: boolean;
  showPrivacyModal: boolean;
  transitioning: boolean;
  recording: boolean;
  robot: string;
  recorderVolume: number;
}

class Pages extends React.Component<PagesProps, PagesState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private content: HTMLElement;
  private bg: HTMLElement;
  private installApp: HTMLElement;
  private iOSBackground: any[];

  state: PagesState = {
    isMenuVisible: false,
    scrolled: false,
    showContactModal: false,
    showPrivacyModal: false,
    transitioning: false,
    recording: false,
    robot: '',
    recorderVolume: 100,
  };

  constructor(props?: PagesProps) {
    super(props);

    // On native iOS, we found some issues animating the css background
    // image during recording, so we use this as a more performant alternative.
    this.iOSBackground = [];
    if (isNativeIOS()) {
      this.iOSBackground = [
        <img src="/img/wave-blue-mobile.png" />,
        <img src="/img/wave-red-mobile.png" />,
      ];
    }

    this.uploadRecordings = this.uploadRecordings.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onRecordStop = this.onRecordStop.bind(this);
    this.sayThanks = this.sayThanks.bind(this);
    this.clearRobot = this.clearRobot.bind(this);
    this.openInApp = this.openInApp.bind(this);
    this.closeOpenInApp = this.closeOpenInApp.bind(this);
    this.onVolume = this.onVolume.bind(this);
  }

  private onVolume(volume: number) {
    if (!this.state.transitioning && this.state.recording) {
      this.setState({ recorderVolume: volume });
    }
  }

  /**
   * If the iOS app is installed, open it. Otherwise, open the App Store.
   */
  private openInApp() {
    // TODO: Enable custom protocol when we publish an ios app update.
    // window.location.href = 'commonvoice://';

    window.location.href = getItunesURL();
  }

  private closeOpenInApp(evt: React.MouseEvent<HTMLElement>) {
    evt.stopPropagation();
    evt.preventDefault();
    this.installApp.classList.add('hide');
  }

  private sayThanks(): void {
    this.setState({
      robot: 'thanks',
    });
  }

  private clearRobot(): void {
    this.setState({
      robot: '',
    });
  }

  private onRecord() {
    // Callback function for when we've hidden the normal background.
    let cb = () => {
      this.bg.removeEventListener('transitionend', cb);
      this.setState({
        transitioning: false,
        recording: true,
      });
    };
    this.bg.addEventListener('transitionend', cb);

    this.setState({
      transitioning: true,
      recording: false,
    });
  }

  private onRecordStop() {
    this.setState({
      recording: false,
    });
  }

  private addScrollListener() {
    this.scroller.addEventListener('scroll', evt => {
      let scrolled = this.scroller.scrollTop > 0;
      if (scrolled !== this.state.scrolled) {
        this.setState({ scrolled: scrolled });
      }
    });
  }

  private handlePrivacyAction(didAgree: boolean): void {}

  private ensurePrivacyAgreement(): Promise<void> {
    if (this.props.user.privacyAgreed) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      this.handlePrivacyAction = (didAgree: boolean): void => {
        this.handlePrivacyAction = null;
        this.setState({
          showPrivacyModal: false,
        });

        if (didAgree) {
          this.props.updateUser({ privacyAgreed: true });
          resolve();
        } else {
          reject();
        }
      };
      this.setState({
        showPrivacyModal: true,
      });
    });
  }

  private async uploadRecordings(
    recordings: any[],
    sentences: string[],
    progressCb: Function
  ): Promise<void> {
    await this.ensurePrivacyAgreement();
    const originalTotal = recordings.length;

    for (let runningTotal = 1; runningTotal <= originalTotal; runningTotal++) {
      const recording = recordings.pop();
      const blob = recording.blob;
      const sentence = sentences.pop();

      await this.props.api.uploadAudio(blob, sentence);
      this.props.tallyRecording();

      if (recordings.length !== 0) {
        let percentage = Math.floor(runningTotal / originalTotal * 100);
        progressCb && progressCb(percentage);
      }
    }
    await this.props.api.uploadDemographicInfo();

    // Reset robot state to initial state
    this.setState({
      robot: '',
    });
  }

  private scrollToTop = () => {
    this.content.children[0].removeEventListener(
      'animationend',
      this.scrollToTop
    );

    // After changing pages we will scroll to the top, which
    // is accomplished differentonly on mobile vs. desktop.
    this.scroller.scrollTop = 0; // Scroll up on mobile.
    this.setState(
      {
        isMenuVisible: false,
      },
      () => {
        // Scroll to top on desktop.
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    );
  };

  componentDidMount() {
    this.addScrollListener();
  }

  componentDidUpdate(nextProps: PagesProps) {
    if (this.props.location !== nextProps.location) {
      this.setState({ robot: '' });
      this.content.children[0].addEventListener(
        'animationend',
        this.scrollToTop
      );
    }
  }

  private toggleContactModal = () => {
    this.setState(state => ({ showContactModal: !state.showContactModal }));
  };

  toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  render() {
    const pageName = this.props.location.pathname.substr(1) || 'home';
    let className = pageName;
    if (this.state.transitioning) {
      className += ' hiding';
    } else if (this.state.recording) {
      className += ' recording';
    }

    let bgStyle: any = {};
    if (this.state.recording) {
      let scale = Math.max(1.3 * (this.state.recorderVolume - 28) / 100, 0);
      bgStyle.transform = 'scaleY(' + scale + ')';
    }

    return (
      <div id="main" className={className}>
        {this.state.showContactModal && (
          <ContactModal onRequestClose={this.toggleContactModal} />
        )}
        {isIOS() &&
          !isNativeIOS() &&
          !isSafari() && (
            // This is a banner for non-Safari browsers on iOS.
            // In iOS Safari, we display a 'Smart App Banner' instead.
            <div
              id="install-app"
              onClick={this.openInApp}
              ref={div => {
                this.installApp = div as HTMLElement;
              }}>
              Open in App
              <a onClick={this.closeOpenInApp}>X</a>
            </div>
          )}
        <header
          className={
            this.state.isMenuVisible || this.state.scrolled ? 'active' : ''
          }
          ref={header => {
            this.header = header as HTMLElement;
          }}>
          <Logo />
          <button
            id="hamburger-menu"
            onClick={this.toggleMenu}
            className={this.state.isMenuVisible ? 'active' : ''}>
            <Icon type="hamburger" />
          </button>
          {this.renderNav('main-nav', true)}
        </header>
        <div
          id="scroller"
          ref={div => {
            this.scroller = div as HTMLElement;
          }}>
          <div id="scrollee">
            <div
              id="background-container"
              style={bgStyle}
              ref={div => {
                this.bg = div as HTMLElement;
              }}>
              {this.iOSBackground}
            </div>
            <div className="hero">
              <Robot
                position={
                  (pageName === 'record' && this.state.robot) || pageName
                }
              />
            </div>
            <div className="hero-space" />
            <div
              id="content"
              ref={div => {
                this.content = div as HTMLElement;
              }}>
              <Switch>
                <Route
                  exact
                  path={URLS.ROOT}
                  render={props => <Home api={this.props.api} {...props} />}
                />
                <Route
                  exact
                  path={URLS.RECORD}
                  render={props => (
                    <Record
                      onRecord={this.onRecord}
                      onRecordStop={this.onRecordStop}
                      onRecordingSet={this.sayThanks}
                      onVolume={this.onVolume}
                      onSubmit={this.uploadRecordings}
                      onDelete={this.clearRobot}
                      {...props}
                    />
                  )}
                />
                <Route
                  exact
                  path={URLS.PROFILE}
                  render={props => <Profile {...props} />}
                />
                <Route exact path={URLS.FAQ} component={FAQ} />} />
                <Route exact path={URLS.PRIVACY} component={Privacy} />} />
                <Route exact path={URLS.TERMS} component={Terms} />} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <footer>
              <div id="help-links">
                <div className="content">
                  <Link id="help" to={URLS.FAQ}>
                    <Icon type="help" />
                    <p className="strong">Help</p>
                  </Link>
                  <a
                    id="contribute"
                    target="_blank"
                    href="https://github.com/mozilla/voice-web">
                    <Icon type="github" />
                    <p className="strong">Contribute</p>
                  </a>
                  <a
                    id="discourse"
                    target="blank"
                    href="https://discourse.mozilla-community.org/c/voice">
                    <Icon type="discourse" />
                    <p className="strong">Community</p>
                  </a>
                  <a onClick={this.toggleContactModal}>
                    <Icon type="contact" />
                    <p className="strong">Contact</p>
                  </a>
                </div>
              </div>
              <div id="moz-links">
                <div className="content">
                  <Logo reverse={true} />
                  <div className="links">
                    <p>
                      <Link to={URLS.PRIVACY}>Privacy</Link>
                      <Link to={URLS.TERMS}>Terms</Link>
                      <a
                        target="_blank"
                        href="https://www.mozilla.org/en-US/privacy/websites/#cookies">
                        Cookies
                      </a>
                      <Link to={URLS.FAQ}>FAQ</Link>
                    </p>
                    <p>
                      Content available under a&nbsp;<a
                        target="_blank"
                        href="https://www.mozilla.org/en-US/foundation/licensing/website-content/">
                        Creative Commons license
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </div>
        <div
          id="navigation-modal"
          className={this.state.isMenuVisible ? 'active' : ''}
          onClick={this.toggleMenu}>
          {this.renderNav()}
        </div>
        {this.state.showPrivacyModal && (
          <Modal
            buttons={{
              'I agree': () => this.handlePrivacyAction(true),
              'I do not agree': () => this.handlePrivacyAction(false),
            }}>
            By using Common Voice, you agree to our{' '}
            <a target="_blank" href="/terms">
              Terms
            </a>{' '}
            and{' '}
            <a target="_blank" href="/privacy">
              Privacy Notice
            </a>.
          </Modal>
        )}
      </div>
    );
  }

  private renderNav(id?: string, hideHome?: boolean) {
    return (
      <nav id={id} className="nav-list">
        {!hideHome && (
          <NavLink to="/" exact>
            Home
          </NavLink>
        )}
        <NavLink to="/record" exact>
          Speak
        </NavLink>
        <NavLink to="/profile" exact>
          Profile
        </NavLink>
      </nav>
    );
  }

  private renderUser() {
    return (
      <div id="tally-box">
        <span className="tally-recordings">{this.props.user.recordTally}</span>
        <span className="tally-verifications">
          {this.props.user.validateTally}
        </span>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({
  api: apiSelector(state),
  user: state.user,
});

const mapDispatchToProps = {
  tallyRecording: actions.tallyRecording,
  updateUser: actions.update,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Pages)
);
