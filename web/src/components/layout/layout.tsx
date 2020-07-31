import { Localized } from '@fluent/react';
import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect, withRouter } from 'react-router';
import * as FullStory from '@fullstory/browser';
import { LOCALES, NATIVE_NAMES } from '../../services/localization';
import { trackGlobal, getTrackClass } from '../../services/tracker';
import StateTree from '../../stores/tree';
import { User } from '../../stores/user';
import { Locale } from '../../stores/locale';
import URLS from '../../urls';
import { isProduction, replacePathLocale } from '../../utility';
import { LocaleLink, LocaleNavLink, isContributable } from '../locale-helpers';
import {
  CogIcon,
  DashboardIcon,
  MenuIcon,
  MicIcon,
  OldPlayIcon,
  TargetIcon,
  ExternalLinkIcon,
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
  FeatureType,
  FeatureToken,
  features,
} from 'common';
import API from '../../services/api';
import NotificationBanner from './../notification-banner/notification-banner';
import { Notifications } from '../../stores/notifications';

const LOCALES_WITH_NAMES = LOCALES.map(code => [
  code,
  NATIVE_NAMES[code] || code,
]).sort((l1, l2) => l1[1].localeCompare(l2[1]));

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
    RouteComponentProps<any, any, any> {}

interface LayoutState {
  challengeTeamToken: ChallengeTeamToken;
  challengeToken: ChallengeToken;
  isMenuVisible: boolean;
  hasScrolled: boolean;
  hasScrolledDown: boolean;
  showStagingBanner: boolean;
  showWelcomeModal: boolean;
  featureStorageKey?: string;
}

const SegmentBanner = ({
  locale,
  featureStorageKey,
}: {
  locale: string;
  featureStorageKey: string;
}) => {
  const notification: Notifications.Notification = {
    id: 99,
    kind: 'banner',
    content: (
      <>
        <Localized
          id="target-segment-first-banner"
          vars={{ locale: NATIVE_NAMES[locale] }}
        />
      </>
    ),
    bannerProps: {
      storageKey: featureStorageKey,
      links: [
        {
          to: URLS.SPEAK,
          className: 'cta',
          persistAfterClick: true,
          children: (
            <>
              <TargetIcon />
              <Localized
                key="target-segment-add-voice"
                id="target-segment-add-voice">
                <div />
              </Localized>
            </>
          ),
        },
        {
          href:
            locale === 'es'
              ? URLS.TARGET_SEGMENT_INFO_ES
              : URLS.TARGET_SEGMENT_INFO,
          blank: true,
          persistAfterClick: true,
          className: 'cta external',
          children: (
            <>
              <ExternalLinkIcon />
              <Localized
                key="target-segment-learn-more"
                id="target-segment-learn-more">
                <div />
              </Localized>
            </>
          ),
        },
      ],
    },
  };

  return (
    <NotificationBanner key="target-segment" notification={notification} />
  );
};

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
    featureStorageKey: null,
  };

  async componentDidMount() {
    const { locale, api, user } = this.props;
    this.scroller.addEventListener('scroll', this.handleScroll);
    this.visitHash();

    const challengeTeamToken = this.getTeamToken();
    const challengeToken = this.getChallengeToken();

    this.setState({
      challengeTeamToken: challengeTeamToken,
      challengeToken: challengeToken,
      showWelcomeModal:
        challengeTeamToken !== undefined && challengeToken !== undefined,
      featureStorageKey: await this.getFeatureKey(locale),
    });

    try {
      FullStory.setUserVars({ isLoggedIn: !!user.account });
    } catch (e) {
      // do nothing if FullStory not initialized (see app.tsx)
    }
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
    this.setState({
      featureStorageKey: await this.getFeatureKey(locale),
    });
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

  private async getFeatureKey(locale: string) {
    let feature = null;

    if (isContributable(locale)) {
      feature = await this.props.api.getFeatureFlag(
        'singleword_benchmark',
        locale
      );
    }

    return feature ? feature.storageKey : null;
  }

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
      featureStorageKey,
    } = this.state;
    const isBuildingProfile = location.pathname.includes(URLS.PROFILE_INFO);

    const pathParts = location.pathname
      .replace(/(404|503)/g, 'error-page')
      .split('/');
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
        {featureStorageKey &&
          localStorage.getItem(featureStorageKey) !== 'true' && (
            <SegmentBanner
              locale={locale}
              featureStorageKey={featureStorageKey}
            />
          )}
        {showStagingBanner && (
          <div className="staging-banner">
            You're on the staging server. Voice data is not collected here.{' '}
            <a
              href={URLS.HTTP_ROOT}
              target="_blank"
              rel="noopener noreferrer">
              Don't waste your breath.
            </a>{' '}
            <a
              href={`${URLS.GITHUB_ROOT}/issues/new`}
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
            <Content location={location} />
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
                <>
                  {user.account ? (
                    <Localized id="logout">
                      <LinkButton rounded href="/logout" />
                    </Localized>
                  ) : (
                    <Localized id="login-signup">
                      <LinkButton rounded href="/login" />
                    </Localized>
                  )}
                </>
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
