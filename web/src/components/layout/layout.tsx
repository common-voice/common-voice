import { Localized } from 'fluent-react';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  getNativeNameWithFallback,
  LOCALES,
} from '../../services/localization';
import { Recordings } from '../../stores/recordings';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Locale } from '../../stores/locale';
import URLS from '../../urls';
import {
  getItunesURL,
  isNativeIOS,
  isIOS,
  isSafari,
  replacePathLocale,
} from '../../utility';
import {
  MenuIcon,
  RecordIcon,
  OldPlayIcon,
  ChevronRight,
  CrossIcon,
} from '../ui/icons';
import { LabeledSelect, LinkButton } from '../ui/ui';
import { ContributableLocaleLock } from '../locale-helpers';
import Content from './content';
import Footer from './footer';
import LanguageSelect from './language-select';
import Logo from './logo';
import Nav from './nav';
import Robot from './robot';

const LOW_FPS = 20;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;

const LOCALES_WITH_NAMES = LOCALES.map(code => [
  code,
  getNativeNameWithFallback(code),
]).sort((l1, l2) => l1[1].localeCompare(l2[1]));

interface PropsFromState {
  locale: Locale.State;
  isSetFull: boolean;
  user: User.State;
}

interface PropsFromDispatch {
  setLocale: typeof Locale.actions.set;
}

interface LayoutProps
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any> {}

interface LayoutState {
  isMenuVisible: boolean;
  hasScrolled: boolean;
  hasScrolledDown: boolean;
  transitioning: boolean;
  isRecording: boolean;
  showContributionBanner: boolean;
  showStagingBanner: boolean;
}

const CONTRIBUTION_BANNER_KEY = 'showContributionBanner';

class Layout extends React.PureComponent<LayoutProps, LayoutState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
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
    hasScrolled: false,
    hasScrolledDown: false,
    transitioning: false,
    isRecording: false,
    showContributionBanner: false,
    // While showing the survey we're not showing the contribution banner
    // JSON.parse(localStorage.getItem(CONTRIBUTION_BANNER_KEY)) !== false,
    showStagingBanner: true,
  };

  componentDidMount() {
    this.scroller.addEventListener('scroll', this.handleScroll);
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

      // Immediately scrolling up after page change has no effect.
      setTimeout(() => {
        this.scroller.scrollTop = 0;
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }, 250);
    }
  }

  componentWillUnmount() {
    this.scroller.removeEventListener('scroll', this.handleScroll);
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

  lastScrollTop: number;
  private handleScroll = () => {
    const { scrollTop } = this.scroller;
    this.setState({
      hasScrolled: scrollTop > 0,
      hasScrolledDown: scrollTop > this.lastScrollTop,
    });
    this.lastScrollTop = scrollTop;
  };

  private toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  private selectLocale = async (locale: string) => {
    const { setLocale, history } = this.props;
    setLocale(locale);
    history.push(replacePathLocale(history.location.pathname, locale));
  };

  private closeContributionBanner = () => {
    this.setState({ showContributionBanner: false });
    localStorage.setItem(CONTRIBUTION_BANNER_KEY, JSON.stringify(false));
  };

  render() {
    const { isSetFull, locale, location } = this.props;
    const {
      hasScrolled,
      hasScrolledDown,
      isMenuVisible,
      showContributionBanner,
      showStagingBanner,
    } = this.state;

    const pageName = location.pathname.split('/')[2] || 'home';
    let className = pageName;
    if (this.state.isRecording) {
      className += ' recording';
    }

    return (
      <div id="main" className={className}>
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
        {window.location.hostname == 'voice.allizom.org' &&
          showStagingBanner && (
            <div className="staging-banner">
              You're on the staging server. Voice data is not collected here.{' '}
              <a href="https://voice.mozilla.org" target="_blank">
                Don't waste your breath.
              </a>{' '}
              <a
                href="https://github.com/mozilla/voice-web/issues/new"
                target="_blank">
                Feel free to report issues.
              </a>{' '}
              <button
                onClick={() => this.setState({ showStagingBanner: false })}>
                Close
              </button>
            </div>
          )}
        <header
          className={
            !isMenuVisible &&
            (hasScrolled ? 'active' : '') +
              ' ' +
              (hasScrolledDown ? 'hidden' : '')
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
              <LanguageSelect
                locale={locale}
                locales={LOCALES_WITH_NAMES}
                onChange={this.selectLocale}
              />
            )}
            <button
              id="hamburger-menu"
              onClick={this.toggleMenu}
              className={isMenuVisible ? 'active' : ''}>
              <MenuIcon className={isMenuVisible ? 'active' : ''} />
            </button>
          </div>
        </header>
        {showContributionBanner && (
          <ContributableLocaleLock>
            <div className="contribution-banner">
              <div className="inner">
                <Localized id="contribution-banner-text">
                  <h1 />
                </Localized>
                <Localized id="contribution-banner-button">
                  <LinkButton className="open" rounded to={URLS.SPEAK} />
                </Localized>
                <a
                  className="bugs-link"
                  href="https://github.com/mozilla/voice-web/issues/new"
                  target="_blank">
                  <Localized id="report-bugs-link">
                    <span />
                  </Localized>
                  <ChevronRight />
                </a>
                <button
                  type="button"
                  className="close"
                  onClick={this.closeContributionBanner}>
                  <CrossIcon />
                </button>
              </div>
            </div>
          </ContributableLocaleLock>
        )}
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
                {LOCALES_WITH_NAMES.map(([code, name]) => (
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
          <OldPlayIcon className="icon" />
          {user.validateTally}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  locale: state.locale,
  isSetFull: Recordings.selectors.isSetFull(state),
  user: state.user,
});

const mapDispatchToProps = {
  setLocale: Locale.actions.set,
};

export default withRouter(
  connect<PropsFromState, PropsFromDispatch>(
    mapStateToProps,
    mapDispatchToProps
  )(Layout)
);
