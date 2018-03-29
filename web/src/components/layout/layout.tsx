import * as React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, RouteComponentProps, withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
const { Localized } = require('fluent-react');
import { Recordings } from '../../stores/recordings';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Clips } from '../../stores/clips';
import URLS from '../../urls';
import {getItunesURL, isNativeIOS, isIOS, isSafari, isProduction} from '../../utility';
import { MenuIcon, RecordIcon, PlayIcon } from '../ui/icons';
import Robot from './robot';
import Home from '../pages/home/home';
import LanguagesPages from '../pages/languages/languages';
import Record from '../pages/record/record';
import Data from '../pages/data/data';
import Profile from '../pages/profile';
import FAQ from '../pages/faq';
import Privacy from '../pages/privacy';
import Terms from '../pages/terms';
import NotFound from '../pages/not-found';
import Footer from './footer';
import Logo from './logo';

const KEYBOARD_FOCUS_CLASS_NAME = 'is-keyboard-focus';

const LOW_FPS = 20;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;

interface PropsFromState {
  isSetFull: boolean;
  user: User.State;
}

interface PropsFromDispatch {
  buildNewSentenceSet: typeof Recordings.actions.buildNewSentenceSet;
  fillClipCache: typeof Clips.actions.refillCache;
}

interface LayoutProps
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {
  locale: string;
}

interface LayoutState {
  isMenuVisible: boolean;
  scrolled: boolean;
  transitioning: boolean;
  isRecording: boolean;
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private content: HTMLElement;
  private bg: HTMLElement;
  private installApp: HTMLElement;
  private stopBackgroundRender: boolean;

  // On native iOS, we found some issues animating the css background
  // image during recording, so we use this as a more performant alternative.
  private iOSBackground = isNativeIOS()
    ? [
        <img src="/img/wave-blue-mobile.png" />,
        <img src="/img/wave-red-mobile.png" />,
      ]
    : [];

  state: LayoutState = {
    isMenuVisible: false,
    scrolled: false,
    transitioning: false,
    isRecording: false,
  };

  componentDidMount() {
    this.props.buildNewSentenceSet();
    this.props.fillClipCache();
    this.addScrollListener();
  }

  componentDidUpdate(nextProps: LayoutProps, nextState: LayoutState) {
    if (nextState.isRecording) {
      this.stopBackgroundRender = false;
      this.renderBackground();
    } else if (!nextState.isRecording) {
      this.stopBackgroundRender = true;
      this.bg.style.transform = '';
    }

    if (this.props.location !== nextProps.location) {
      this.setState({ isRecording: false });
      const mainContent = this.content.children[0];
      mainContent &&
        mainContent.addEventListener('animationend', this.scrollToTop);
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
    this.scroller.addEventListener('scroll', () => {
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

  basePath: string;
  render() {
    const pageName = this.props.location.pathname.split('/')[2] || 'home';
    let className = pageName;
    if (this.state.isRecording) {
      className += ' recording';
    }

    this.basePath = '/' + this.props.locale;

    return (
      <div
        id="main"
        className={className}
        onKeyDown={this.showKeyboardFocus}
        onClick={this.hideKeyboardFocus}>
        {isIOS() &&
          !isNativeIOS() &&
          !isSafari() && (
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
          <Logo to={this.basePath} />
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
            {this.renderContent()}
            <Footer basePath={this.basePath} />
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
          <NavLink to={this.basePath + URLS.RECORD} exact />
        </Localized>
        <Localized id="datasets">
          <NavLink to={this.basePath + URLS.DATA} exact />
        </Localized>
        {!isProduction() && <Localized id="languages">
          <NavLink to={this.basePath + URLS.LANGUAGES} exact />
        </Localized>}
        <Localized id="profile">
          <NavLink to={this.basePath + URLS.PROFILE} exact />
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

  private renderContent() {
    return (
      <div
        id="content"
        ref={div => {
          this.content = div as HTMLElement;
        }}>
        <Switch>
          <Route exact path={this.basePath + URLS.ROOT} component={Home} />
          <Route
            exact
            path={this.basePath + URLS.RECORD}
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
          <Route
            exact
            path={this.basePath + URLS.LANGUAGES}
            component={LanguagesPages}
          />
          <Route exact path={this.basePath + URLS.DATA} component={Data} />
          <Route
            exact
            path={this.basePath + URLS.PROFILE}
            component={Profile}
          />
          <Route exact path={this.basePath + URLS.FAQ} component={FAQ} />
          <Route
            exact
            path={this.basePath + URLS.PRIVACY}
            component={Privacy}
          />
          <Route exact path={this.basePath + URLS.TERMS} component={Terms} />
          <Route component={NotFound} />
        </Switch>
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
  fillClipCache: Clips.actions.refillCache,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Layout)
);
