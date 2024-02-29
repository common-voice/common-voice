import { Localized } from '@fluent/react';
import classNames from 'classnames';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';
import { trackGlobal } from '../../services/tracker';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Locale } from '../../stores/locale';
import URLS from '../../urls';
import { replacePathLocale } from '../../utility';
import { LocaleNavLink } from '../locale-helpers';
import { CogIcon, DashboardIcon, MenuIcon } from '../ui/icons';
import { Avatar, LinkButton } from '../ui/ui';
import DonateButton from '../donate-button/donate-button';
import Content from './content';
import Footer from './footer';
import LocalizationSelect from '../localization-select/localization-select';
import LocalizationSelectComplex from '../localization-select/localization-select-complex';
import Logo from './logo';
import Nav from './nav/nav';
import UserMenu from './user-menu';
import cx from 'classnames';
import WelcomeModal from '../welcome-modal/welcome-modal';
import NonProductionBanner from './non-production-banner';
import {
  ChallengeTeamToken,
  challengeTeamTokens,
  ChallengeToken,
  challengeTokens,
} from 'common';
import API from '../../services/api';
import { SecondaryNav } from './nav/secondary-nav';

interface PropsFromState {
  locale: Locale.State;
  user: User.State;
  api: API;
}

interface PropsFromDispatch {
  setLocale: typeof Locale.actions.set;
}

interface LayoutProps
  extends PropsFromState,
    PropsFromDispatch,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    RouteComponentProps<any, any, any> {
  children?: React.ReactNode;
  shouldHideFooter?: boolean;
}

interface LayoutState {
  challengeTeamToken: ChallengeTeamToken;
  challengeToken: ChallengeToken;
  isMenuVisible: boolean;
  hasScrolled: boolean;
  showWelcomeModal: boolean;
  featureStorageKey?: string;
  shouldExpandNavItems: boolean;
}

class Layout extends React.PureComponent<LayoutProps, LayoutState> {
  private installApp: HTMLElement;

  state: LayoutState = {
    challengeTeamToken: undefined,
    challengeToken: undefined,
    isMenuVisible: false,
    hasScrolled: false,

    showWelcomeModal: false,
    featureStorageKey: null,
    shouldExpandNavItems: false,
  };

  async componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
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

  componentDidUpdate(prevProps: LayoutProps) {
    const { pathname, key, hash } = this.props.location;
    const { setLocale, locale } = this.props;

    const hasPathnameChanged = pathname !== prevProps.location.pathname;
    const locationKeyHasChanged = key !== prevProps.location.key;
    const shouldScrollToHash = hash && locationKeyHasChanged;
    const hasLocaleChanged = prevProps.locale !== locale;

    if (hasPathnameChanged) {
      this.setState({ isMenuVisible: false });
      window.scrollTo({ top: 0 });
      this.visitHash();
    }

    if (!hasPathnameChanged && shouldScrollToHash) {
      this.visitHash();
    }

    if (hasLocaleChanged) {
      setLocale(locale);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private visitHash() {
    if (location.hash) {
      const hash = location.hash.split('?')[0];
      const node = document.querySelector(hash);
      if (node) {
        node.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  private handleScroll = () => {
    const { scrollY } = window;
    this.setState({
      hasScrolled: scrollY > 0,
    });
  };

  private toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  };

  private handleLocaleChange = async (locale: string) => {
    const { history } = this.props;
    trackGlobal('change-language', locale);
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
    const { children, locale, location, user, shouldHideFooter } = this.props;
    const {
      challengeTeamToken,
      challengeToken,
      hasScrolled,
      isMenuVisible,
      showWelcomeModal,
    } = this.state;

    const CONTRIBUTION_PAGES = [
      `/${locale}${URLS.SPEAK}`,
      `/${locale}${URLS.LISTEN}`,
      `/${locale}${URLS.WRITE}`,
      `/${locale}${URLS.REVIEW}`,
    ];

    const isBuildingProfile = location.pathname.includes(URLS.PROFILE_INFO);
    const isDemoMode = location.pathname.includes(URLS.DEMO);
    const isContributionPageActive = CONTRIBUTION_PAGES.includes(
      location.pathname
    );
    const pathParts = location.pathname.split('/');
    const className = cx(pathParts[2] ? pathParts.slice(2).join(' ') : 'home', {
      'nav-modal-active': this.state.isMenuVisible,
    });

    const alreadyEnrolled =
      this.state.showWelcomeModal && user.account?.enrollment?.challenge;
    const redirectURL = URLS.DASHBOARD + URLS.CHALLENGE;

    const handleMenuIconClick = () => {
      this.setState({ shouldExpandNavItems: !this.state.shouldExpandNavItems });
    };

    const handleSecondaryNavMobileMenuClick = () => {
      this.toggleMenu();
      this.setState({ shouldExpandNavItems: true });
    };

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
        <div
          className={cx('header-wrapper', {
            'contribution-page-active': isContributionPageActive,
          })}>
          <header className={cx('header', { active: hasScrolled })}>
            <div>
              {isContributionPageActive && (
                <MenuIcon
                  onClick={handleMenuIconClick}
                  className={cx(
                    { active: this.state.shouldExpandNavItems },
                    'desktop-menu-icon'
                  )}
                />
              )}
              {(!isContributionPageActive || this.state.isMenuVisible) && (
                <MenuIcon
                  onClick={this.toggleMenu}
                  className={cx(
                    { active: this.state.isMenuVisible },
                    'mobile-menu-icon'
                  )}
                />
              )}
              <Logo />
              <Nav
                id="main-nav"
                shouldExpandNavItems={
                  this.state.shouldExpandNavItems || !isContributionPageActive
                }
                isContributionPageActive={isContributionPageActive}
              />
            </div>
            <div>
              <div className="hidden-sm-down">
                <DonateButton shouldApplyRightMargin={!user.account} />
              </div>
              {user.account ? (
                <UserMenu />
              ) : isBuildingProfile ? null : (
                <Localized id="login-signup">
                  <LinkButton
                    className="login"
                    href="/login"
                    rounded
                    outline
                    data-testid="login-button"
                  />
                </Localized>
              )}
              <LocalizationSelectComplex
                locale={locale}
                onLocaleChange={this.handleLocaleChange}
              />
              <button
                id="hamburger-menu"
                className={classNames({
                  active: isMenuVisible,
                  'logged-in': user.account,
                })}>
                {user.account ? (
                  <LinkButton href="/profile" className="avatar">
                    <Avatar url={user.account.avatar_url} />
                  </LinkButton>
                ) : (
                  <Localized id="login">
                    <LinkButton href="/login" rounded outline />
                  </Localized>
                )}
              </button>
            </div>
          </header>
          {isContributionPageActive && (
            <SecondaryNav
              handleSecondaryNavMobileMenuClick={
                handleSecondaryNavMobileMenuClick
              }
              isDemoMode={isDemoMode}
              isLoggedIn={Boolean(user.account)}
            />
          )}
        </div>
        <NonProductionBanner />
        <main
          id="content"
          className={className}
          data-testid={pathParts[2] ? pathParts.slice(2).join(' ') : 'home'}>
          {children ? children : <Content location={location} />}
        </main>
        {shouldHideFooter ? <></> : <Footer />}
        <div
          id="navigation-modal"
          className={this.state.isMenuVisible ? 'active' : ''}>
          <Nav
            shouldExpandNavItems={
              this.state.shouldExpandNavItems || !isContributionPageActive
            }
            isContributionPageActive={isContributionPageActive}>
            <div className="user-nav">
              <LocalizationSelect
                locale={locale}
                onLocaleChange={this.handleLocaleChange}
              />

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
              {user.account ? (
                <Localized id="logout">
                  <LinkButton rounded href="/logout" className="auth-button" />
                </Localized>
              ) : (
                <Localized id="login-signup">
                  <LinkButton rounded href="/login" className="auth-button" />
                </Localized>
              )}

              <div className="donate-btn-container">
                <DonateButton />
              </div>
            </div>
          </Nav>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: StateTree) => ({
  locale: state.locale,
  user: state.user,
  api: state.api,
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
