import { Localized } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';
import { LOCALES, NATIVE_NAMES } from '../../services/localization';
import { trackGlobal, getTrackClass } from '../../services/tracker';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Locale } from '../../stores/locale';
import URLS from '../../urls';
import { getItunesURL, isProduction, replacePathLocale } from '../../utility';
import { LocaleLink, LocaleNavLink } from '../locale-helpers';
import {
  CogIcon,
  DashboardIcon,
  MenuIcon,
  MicIcon,
  OldPlayIcon,
} from '../ui/icons';
import { Avatar, LabeledSelect, LinkButton } from '../ui/ui';
import Content from './content';
import Footer from './footer';
import LocalizationSelect from './localization-select';
import Logo from './logo';
import Nav from './nav';
import UserMenu from './user-menu';
import * as cx from 'classnames';
import WelcomeModal from '../welcome-modal/welcome-modal';
import {
  ChallengeTeamToken,
  challengeTeamTokens,
  ChallengeToken,
  challengeTokens,
} from 'common';

const LOCALES_WITH_NAMES = LOCALES.map(code => [
  code,
  NATIVE_NAMES[code] || code,
]).sort((l1, l2) => l1[1].localeCompare(l2[1]));

interface PropsFromState {
  locale: Locale.State;
  user: User.State;
}

interface PropsFromDispatch {
  setLocale: typeof Locale.actions.set;
}

interface LayoutProps
  extends PropsFromState,
    PropsFromDispatch,
    RouteComponentProps<any, any, any> {}

interface LayoutState {
  challengeTeamToken: ChallengeTeamToken;
  challengeToken: ChallengeToken;
  isMenuVisible: boolean;
  hasScrolled: boolean;
  hasScrolledDown: boolean;
  showStagingBanner: boolean;
  showWelcomeModal: boolean;
}

class Layout extends React.PureComponent<LayoutProps, LayoutState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private installApp: HTMLElement;

  state: LayoutState = {
    challengeTeamToken: undefined,
    challengeToken: undefined,
    isMenuVisible: false,
    hasScrolled: false,
    hasScrolledDown: false,
    showStagingBanner: !isProduction(),
    showWelcomeModal: false,
  };

  componentDidMount() {
    this.scroller.addEventListener('scroll', this.handleScroll);
    this.visitHash();

    const challengeTeamToken = this.getTeamToken();
    const challengeToken = this.getChallengeToken();

    this.setState({
      challengeTeamToken: challengeTeamToken,
      challengeToken: challengeToken,
      showWelcomeModal:
        challengeTeamToken !== undefined && challengeToken !== undefined,
    });
  }

  componentDidUpdate(nextProps: LayoutProps, nextState: LayoutState) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      this.setState({ isMenuVisible: false });

      // Immediately scrolling up after page change has no effect.
      setTimeout(() => {
        if (this.scroller) {
          this.scroller.scrollTop = 0;
        }

        if (location.hash) {
          this.visitHash();
        } else {
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          });
        }
      }, 250);
    }
  }

  componentWillUnmount() {
    this.scroller.removeEventListener('scroll', this.handleScroll);
  }

  private visitHash() {
    if (location.hash) {
      setTimeout(() => {
        const node = document.querySelector(location.hash);
        node && node.scrollIntoView();
      }, 100);
    }
  }

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
    trackGlobal('change-language', locale);
    setLocale(locale);
    history.push(replacePathLocale(history.location.pathname, locale));
  };

  private getChallengeToken = () => {
    return challengeTokens.find(challengeToken =>
      this.props.location.search.includes(`challenge=${challengeToken}`)
    );
  };

  private getTeamToken = () => {
    return challengeTeamTokens.find(challengeTeamToken =>
      this.props.location.search.includes(`team=${challengeTeamToken}`)
    );
  };

  render() {
    const { locale, location, user } = this.props;
    const {
      challengeTeamToken,
      challengeToken,
      hasScrolled,
      hasScrolledDown,
      isMenuVisible,
      showStagingBanner,
      showWelcomeModal,
    } = this.state;
    const isBuildingProfile = location.pathname.includes(URLS.PROFILE_INFO);

    const pathParts = location.pathname.split('/');
    const className = cx(pathParts[2] ? pathParts.slice(2).join(' ') : 'home', {
      'staging-banner-is-visible': showStagingBanner,
    });

    const alreadyEnrolled =
      this.state.showWelcomeModal && user.account?.enrollment?.challenge;
    const redirectURL = URLS.DASHBOARD + URLS.CHALLENGE;

    return (
      <div id="main" className={className}>
        {alreadyEnrolled && <Redirect to={redirectURL} />}
        {showWelcomeModal && !alreadyEnrolled && (
          <WelcomeModal
            onRequestClose={() => {
              this.setState({ showWelcomeModal: false });
            }}
            challengeToken={challengeToken}
            teamToken={challengeTeamToken}
          />
        )}
        {showStagingBanner && (
          <div className="staging-banner">
            You're on the staging server. Voice data is not collected here.{' '}
            <a
              href="https://voice.mozilla.org"
              target="_blank"
              rel="noopener noreferrer">
              Don't waste your breath.
            </a>{' '}
            <a
              href="https://github.com/mozilla/voice-web/issues/new"
              rel="noopener noreferrer"
              target="_blank">
              Feel free to report issues.
            </a>{' '}
            <button onClick={() => this.setState({ showStagingBanner: false })}>
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
            {user.account ? (
              <UserMenu />
            ) : isBuildingProfile ? null : (
              <Localized id="login-signup">
                <LinkButton className="login" href="/login" rounded outline />
              </Localized>
            )}
            {LOCALES.length > 1 && (
              <LocalizationSelect
                locale={locale}
                locales={LOCALES_WITH_NAMES}
                onChange={this.selectLocale}
              />
            )}
            <button
              id="hamburger-menu"
              onClick={this.toggleMenu}
              className={isMenuVisible ? 'active' : ''}>
              {user.account ? (
                <Avatar url={user.account.avatar_url} />
              ) : (
                <MenuIcon className={isMenuVisible ? 'active' : ''} />
              )}
            </button>
          </div>
        </header>
        <div
          id="scroller"
          ref={div => {
            this.scroller = div as HTMLElement;
          }}>
          <div id="scrollee">
            <Content />
            <Footer />
          </div>
        </div>
        <div
          id="navigation-modal"
          className={this.state.isMenuVisible ? 'active' : ''}>
          <Nav>
            <div className="user-nav">
              {LOCALES.length > 1 && (
                <LabeledSelect
                  className="localization-select"
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

              {user.account && (
                <div>
                  <LocaleNavLink className="user-nav-link" to={URLS.DASHBOARD}>
                    <DashboardIcon />
                    <Localized id="dashboard">
                      <span />
                    </Localized>
                  </LocaleNavLink>
                  <LocaleNavLink
                    className="user-nav-link"
                    to={URLS.PROFILE_SETTINGS}>
                    <CogIcon />
                    <Localized id="settings">
                      <span />
                    </Localized>
                  </LocaleNavLink>
                </div>
              )}
              {!isBuildingProfile && (
                <React.Fragment>
                  {user.account ? (
                    <Localized id="logout">
                      <LinkButton rounded href="/logout" />
                    </Localized>
                  ) : (
                    <Localized id="login-signup">
                      <LinkButton rounded href="/login" />
                    </Localized>
                  )}
                </React.Fragment>
              )}
            </div>
          </Nav>
        </div>
      </div>
    );
  }

  private renderTallies() {
    const { user } = this.props;
    return (
      <LocaleLink
        className={[
          'tallies',
          getTrackClass('fs', 'menubar-cta'),
          user.account ? getTrackClass('fs', 'logged-in') : '',
        ].join(' ')}
        to={user.account ? URLS.DASHBOARD : URLS.SPEAK}>
        <div className="record-tally">
          <MicIcon />
          <div>
            {user.account ? user.account.clips_count : user.recordTally}
          </div>
        </div>
        <div className="divider" />
        <div className="validate-tally">
          <OldPlayIcon />
          {user.account ? user.account.votes_count : user.validateTally}
        </div>
      </LocaleLink>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  locale: state.locale,
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
