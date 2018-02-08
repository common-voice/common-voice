import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, RouteComponentProps, withRouter } from 'react-router';
import { Link, NavLink } from 'react-router-dom';
const { Localized } = require('fluent-react');
import { Recordings } from '../stores/recordings';
import StateTree from '../stores/tree';
import { User } from '../stores/user';
import { Validations } from '../stores/validations';
import { getItunesURL, isNativeIOS, isIOS, isSafari } from '../utility';
import ContactModal from './contact-modal/contact-modal';
import Logo from './logo';
import {
  ContactIcon,
  FontIcon,
  MenuIcon,
  RecordIcon,
  DiscourseIcon,
  SupportIcon,
  GithubIcon,
  PlayIcon,
} from './ui/icons';
import Robot from './robot';

import Home from './pages/home/home';
import Record from './pages/record/record';
import Data from './pages/data/data';
import Profile from './pages/profile';
import FAQ from './pages/faq';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

const shareURL = 'https://voice.mozilla.org/';
const encodedShareText = encodeURIComponent(
  'Help teach machines how real people speak, donate your voice at ' + shareURL
);

const URLS = {
  ROOT: '/',
  RECORD: '/record',
  PROFILE: '/profile',
  DATA: '/data',
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found',
};

const KEYBOARD_FOCUS_CLASS_NAME = 'is-keyboard-focus';

const LOW_FPS = 20;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;

interface PropsFromState {
  isSetFull: boolean;
  user: User.State;
}

interface PropsFromDispatch {
  buildNewSentenceSet: typeof Recordings.actions.buildNewSentenceSet;
  fillValidations: typeof Validations.actions.refillCache;
}

interface PagesProps
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface PagesState {
  isMenuVisible: boolean;
  scrolled: boolean;
  showContactModal: boolean;
  transitioning: boolean;
  isRecording: boolean;
}

class Pages extends React.Component<PagesProps, PagesState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private content: HTMLElement;
  private bg: HTMLElement;
  private installApp: HTMLElement;
  private shareURLInput: HTMLInputElement;
  private stopBackgroundRender: boolean;

  // On native iOS, we found some issues animating the css background
  // image during recording, so we use this as a more performant alternative.
  private iOSBackground = isNativeIOS()
    ? [
        <img src="/img/wave-blue-mobile.png" />,
        <img src="/img/wave-red-mobile.png" />,
      ]
    : [];

  state: PagesState = {
    isMenuVisible: false,
    scrolled: false,
    showContactModal: false,
    transitioning: false,
    isRecording: false,
  };

  componentDidMount() {
    this.props.buildNewSentenceSet();
    this.props.fillValidations();
    this.addScrollListener();
  }

  componentDidUpdate(nextProps: PagesProps, nextState: PagesState) {
    if (nextState.isRecording) {
      this.stopBackgroundRender = false;
      this.renderBackground();
    } else if (!nextState.isRecording) {
      this.stopBackgroundRender = true;
      this.bg.style.transform = '';
    }

    if (this.props.location !== nextProps.location) {
      this.setState({ isRecording: false });
      this.content.children[0].addEventListener(
        'animationend',
        this.scrollToTop
      );
    }
  }

  private volume = 0;
  private handleVolumeChange = (volume: number) => {
    this.volume = volume;
  };

  private lastFPSCheckAt = 0;
  private lowFPSCount = 0;
  private framesInLastSecond: number[] = [];
  private renderBackground = () => {
    if (this.stopBackgroundRender) return;
    if (this.lowFPSCount >= DISABLE_ANIMATION_LOW_FPS_THRESHOLD) {
      this.bg.style.transform = `scaleY(1)`;
      return;
    }
    const scale = Math.max(1.3 * (this.volume - 28) / 100, 0);
    this.bg.style.transform = `scaleY(${scale})`;
    requestAnimationFrame(this.renderBackground);

    const now = Date.now();
    this.framesInLastSecond.push(now);
    if (now - this.lastFPSCheckAt < 1000) return;
    this.lastFPSCheckAt = now;
    const index = this.framesInLastSecond
      .slice()
      .reverse()
      .findIndex(t => now - t > 1000);
    if (index === -1) {
      return;
    }

    this.framesInLastSecond = this.framesInLastSecond.slice(
      this.framesInLastSecond.length - index - 1
    );
    if (this.framesInLastSecond.length < LOW_FPS) {
      this.lowFPSCount++;
    }
  };

  /**
   * If the iOS app is installed, open it. Otherwise, open the App Store.
   */
  private openInApp = () => {
    // TODO: Enable custom protocol when we publish an ios app update.
    // window.location.href = 'commonvoice://';

    window.location.href = getItunesURL();
  };

  private closeOpenInApp = (evt: React.MouseEvent<HTMLElement>) => {
    evt.stopPropagation();
    evt.preventDefault();
    this.installApp.classList.add('hide');
  };

  private onRecord = () => {
    // Callback function for when we've hidden the normal background.
    let cb = () => {
      this.bg.removeEventListener('transitionend', cb);
      this.setState({
        transitioning: false,
      });
    };
    this.bg.addEventListener('transitionend', cb);

    this.setState({
      isRecording: true,
      transitioning: true,
    });
  };

  private onRecordStop = () => {
    this.setState({
      isRecording: false,
    });
  };

  private addScrollListener = () => {
    this.scroller.addEventListener('scroll', evt => {
      let scrolled = this.scroller.scrollTop > 0;
      if (scrolled !== this.state.scrolled) {
        this.setState({ scrolled: scrolled });
      }
    });
  };

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

  private copyShareURL = () => {
    this.shareURLInput.select();
    document.execCommand('copy');
  };

  private toggleContactModal = () => {
    this.setState(state => ({ showContactModal: !state.showContactModal }));
  };

  private toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  private showKeyboardFocus = (event: any) => {
    if (event.key == 'Tab') {
      document.body.classList.add(KEYBOARD_FOCUS_CLASS_NAME);
    }
  };

  private hideKeyboardFocus = () => {
    document.body.classList.remove(KEYBOARD_FOCUS_CLASS_NAME);
  };

  render() {
    const pageName = this.props.location.pathname.substr(1) || 'home';
    let className = pageName;
    if (this.state.isRecording) {
      className += ' recording';
    }

    return (
      <div
        id="main"
        className={className}
        onKeyDown={this.showKeyboardFocus}
        onClick={this.hideKeyboardFocus}>
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
            !this.state.isMenuVisible && this.state.scrolled ? 'active' : ''
          }
          ref={header => {
            this.header = header as HTMLElement;
          }}>
          <Logo />
          {this.renderTallies()}
          <button
            id="hamburger-menu"
            onClick={this.toggleMenu}
            className={this.state.isMenuVisible ? 'active' : ''}>
            <MenuIcon className={this.state.isMenuVisible ? 'active' : ''} />
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
              ref={div => {
                this.bg = div as HTMLElement;
              }}>
              {this.iOSBackground}
            </div>
            <div className="hero">
              <Robot
                position={
                  pageName === 'record'
                    ? this.props.isSetFull ? 'thanks' : 'record'
                    : null
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
                <Route exact path={URLS.ROOT} component={Home} />
                <Route
                  exact
                  path={URLS.RECORD}
                  render={props => (
                    <Record
                      isRecording={this.state.isRecording}
                      onRecord={this.onRecord}
                      onRecordStop={this.onRecordStop}
                      onVolume={this.handleVolumeChange}
                      {...props}
                    />
                  )}
                />
                <Route exact path={URLS.DATA} component={Data} />
                <Route exact path={URLS.PROFILE} component={Profile} />
                <Route exact path={URLS.FAQ} component={FAQ} />} />
                <Route exact path={URLS.PRIVACY} component={Privacy} />} />
                <Route exact path={URLS.TERMS} component={Terms} />} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <footer>
              <div id="help-links">
                <Link id="help" to={URLS.FAQ}>
                  <SupportIcon />
                  <Localized id="help">
                    <div />
                  </Localized>
                </Link>
                <div className="divider" />
                <a
                  id="contribute"
                  target="_blank"
                  href="https://github.com/mozilla/voice-web">
                  <GithubIcon />
                  <div>GitHub</div>
                </a>
                <div className="divider" />
                <a
                  id="discourse"
                  target="blank"
                  href="https://discourse.mozilla-community.org/c/voice">
                  <DiscourseIcon />
                  <div>Discourse</div>
                </a>
                <div className="divider" />
                <a href="javascript:void(0)" onClick={this.toggleContactModal}>
                  <ContactIcon />
                  <Localized id="contact">
                    <div />
                  </Localized>
                </a>
              </div>
              <div id="moz-links">
                <div className="content">
                  <Logo reverse={true} />
                  <div className="links">
                    <p>
                      <Localized id="privacy">
                        <Link to={URLS.PRIVACY} />
                      </Localized>
                      <Localized id="terms">
                        <Link to={URLS.TERMS} />
                      </Localized>
                      <Localized id="cookies">
                        <a
                          target="_blank"
                          href="https://www.mozilla.org/en-US/privacy/websites/#cookies"
                        />
                      </Localized>
                      <Localized id="faq">
                        <Link to={URLS.FAQ}>FAQ</Link>
                      </Localized>
                    </p>
                    <p>
                      <Localized
                        id="content-license-text"
                        licenseLink={
                          <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://www.mozilla.org/en-US/foundation/licensing/website-content/"
                          />
                        }>
                        <span />
                      </Localized>
                    </p>
                  </div>
                </div>
                <div id="sharing">
                  <Localized id="share-title">
                    <h3 />
                  </Localized>

                  <div className="icons">
                    <button id="link-copy" onClick={this.copyShareURL}>
                      <input
                        type="text"
                        readOnly
                        value={shareURL}
                        ref={node => (this.shareURLInput = node)}
                      />
                      <FontIcon type="link" />
                    </button>
                    <a
                      href={
                        'https://twitter.com/intent/tweet?text=' +
                        encodedShareText
                      }
                      target="_blank"
                      rel="noopener noreferrer">
                      <FontIcon type="twitter" />
                    </a>
                    <a
                      href={
                        'https://www.facebook.com/sharer/sharer.php?u=' +
                        encodeURIComponent(shareURL)
                      }
                      target="_blank"
                      rel="noopener noreferrer">
                      <FontIcon type="facebook" />
                    </a>
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
      </div>
    );
  }

  private renderNav(id?: string, withTallies?: boolean) {
    return (
      <nav id={id} className="nav-list">
        <Localized id="speak">
          <NavLink to={URLS.RECORD} exact />
        </Localized>
        <Localized id="datasets">
          <NavLink to={URLS.DATA} exact />
        </Localized>
        <Localized id="profile">
          <NavLink to={URLS.PROFILE} exact />
        </Localized>
        {withTallies && this.renderTallies()}
      </nav>
    );
  }

  private renderTallies() {
    const { user } = this.props;
    return (
      <div className="tallies">
        <div className="record-tally">
          <RecordIcon className="icon" />
          <div>{user.recordTally}</div>
        </div>
        <div className="divider" />
        <div className="validate-tally">
          <PlayIcon className="icon" />
          {user.validateTally}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ recordings, user }: StateTree) => ({
  isSetFull: Recordings.selectors.isSetFull(recordings),
  user,
});

const mapDispatchToProps = {
  buildNewSentenceSet: Recordings.actions.buildNewSentenceSet,
  fillValidations: Validations.actions.refillCache,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Pages)
);
