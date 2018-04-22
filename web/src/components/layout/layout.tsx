import { LocalizationProps, Localized, withLocalization } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { LOCALES } from '../../services/localization';
import { Recordings } from '../../stores/recordings';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Locale } from '../../stores/locale';
import {
  getItunesURL,
  isNativeIOS,
  isIOS,
  isSafari,
  replacePathLocale,
} from '../../utility';
import { MenuIcon, RecordIcon, PlayIcon } from '../ui/icons';
import { LabeledSelect } from '../ui/ui';
import Content from './content';
import Footer from './footer';
import Logo from './logo';
import Nav from './nav';
import Robot from './robot';

const KEYBOARD_FOCUS_CLASS_NAME = 'is-keyboard-focus';

const LOW_FPS = 20;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;

interface PropsFromState {
  locale: Locale.State;
  isSetFull: boolean;
  user: User.State;
}

interface PropsFromDispatch {
  setLocale: typeof Locale.actions.set;
}

interface LayoutProps
  extends LocalizationProps,
    PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface LayoutState {
  isMenuVisible: boolean;
  scrolled: boolean;
  transitioning: boolean;
  isRecording: boolean;
}

class Layout extends React.Component<LayoutProps, LayoutState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private contentRef = (React as any).createRef();
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
      this.setState({ isMenuVisible: false, isRecording: false });
      const mainContent = this.contentRef.current.children[0];
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
    this.contentRef.current.children[0].removeEventListener(
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

  private selectLocale = async (locale: string) => {
    const { setLocale, history } = this.props;
    setLocale(locale);
    history.push(replacePathLocale(history.location.pathname, locale));
  };

  render() {
    const { getString, isSetFull, locale, location } = this.props;

    const localesWithNames = LOCALES.map(code => [code, getString(code)]).sort(
      (l1, l2) => l1[1].localeCompare(l2[1])
    );

    const pageName = location.pathname.split('/')[2] || 'home';
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
          <div>
            <Logo />
            <Nav id="main-nav" />
          </div>
          <div>
            {this.renderTallies()}
            {LOCALES.length > 1 && (
              <div className="language-select with-down-arrow">
                <Localized id={locale}>
                  <div className="selection" />
                </Localized>
                <div className="list-wrapper">
                  <div className="triangle" />
                  <ul>
                    {localesWithNames.map(([code, name]) => (
                      <li
                        key={code}
                        className={code === locale ? 'selected' : ''}
                        onClick={() => this.selectLocale(code)}>
                        {name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            <button
              id="hamburger-menu"
              onClick={this.toggleMenu}
              className={this.state.isMenuVisible ? 'active' : ''}>
              <MenuIcon className={this.state.isMenuVisible ? 'active' : ''} />
            </button>
          </div>
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
                    ? isSetFull ? 'thanks' : 'record'
                    : null
                }
              />
            </div>
            <div className="hero-space" />
            <Content
              containerRef={this.contentRef}
              isRecording={this.state.isRecording}
              onRecord={this.onRecord}
              onRecordStop={this.onRecordStop}
              onVolume={this.handleVolumeChange}
            />
            <Footer />
          </div>
        </div>
        <div
          id="navigation-modal"
          className={this.state.isMenuVisible ? 'active' : ''}>
          <Nav>
            {LOCALES.length > 1 && (
              <LabeledSelect
                className="language-select"
                value={locale}
                onChange={(event: any) =>
                  this.selectLocale(event.target.value)
                }>
                {localesWithNames.map(([code, name]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </LabeledSelect>
            )}
          </Nav>
        </div>
      </div>
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

const mapStateToProps = ({ locale, recordings, user }: StateTree) => ({
  locale,
  isSetFull: Recordings.selectors.isSetFull(recordings),
  user,
});

const mapDispatchToProps = {
  setLocale: Locale.actions.set,
};

export default withLocalization(
  withRouter(
    connect<PropsFromState, PropsFromDispatch>(
      mapStateToProps,
      mapDispatchToProps
    )(Layout)
  )
);
