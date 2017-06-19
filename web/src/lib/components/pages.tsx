import { h, Component } from 'preact';
import Logo from './logo';
import Icon from './icon';
import PrivacyContent from './privacy-content';
import Robot from './robot';

import Home from './pages/home';
import Listen from './pages/listen';
import Record from './pages/record';
import Profile from './pages/profile';
import Privacy from './pages/privacy';
import Terms from './pages/terms';
import NotFound from './pages/not-found';

import API from '../api';
import User from '../user';

const URLS = {
  ROOT: '/',
  HOME: '/home',
  RECORD: '/record',
  LISTEN: '/listen',
  PROFILE: '/profile',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found'
};

interface PagesProps {
  user: User;
  api: API;
  currentPage: string;
  navigate(url: string): void;
}

interface PagesState {
  isMenuVisible: boolean;
  pageTransitioning: boolean;
  scrolled: boolean;
  currentPage: string;
  showingPrivacy: boolean;
  onPrivacyAgree?(evt): void;
  onPrivacyDisagree?(evt): void;
  recording: boolean;
  robot: string;
}

export default class Pages extends Component<PagesProps, PagesState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private content: HTMLElement;

  state = {
    isMenuVisible: false,
    pageTransitioning: false,
    scrolled: false,
    currentPage: null,
    showingPrivacy: false,
    onPrivacyAgree: null,
    onPrivacyDisagree: null,
    recording: false,
    robot: ''
  };

  constructor(props) {
    super(props);
    this.uploadRecordings = this.uploadRecordings.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onRecordStop = this.onRecordStop.bind(this);
    this.sayThanks = this.sayThanks.bind(this);
    this.renderUser = this.renderUser.bind(this);
  }

  private getCurrentPageName() {
    return this.state.currentPage && this.state.currentPage.substr(1);
  }

  private sayThanks(): void {
    this.setState({
      robot: 'thanks'
    });
  }

  private isValidPage(url): boolean {
    return Object.keys(URLS).some(key => {
      return URLS[key] === url;
    });
  }

  private isPageActive(url: string|string[], page?: string): string {
    if (!page) {
      page = this.state.currentPage;
    }

    if (!Array.isArray(url)) {
      url = [url];
    }

    let isActive = url.some(u => {
      return u === page;
    });

    return isActive ? 'active' : '';
  }

  private onRecord() {
    this.setState({
      recording: true
    });
  }

  private onRecordStop() {
    this.setState({
      recording: false
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

  private isNotFoundActive(): string {
    return !this.isValidPage(this.props.currentPage) ? 'active' : '';
  }

  private ensurePrivacyAgreement(): Promise<void> {
    if (this.props.user.hasAgreedToPrivacy()) {
      return Promise.resolve();
    }

    return new Promise<void>((res, rej) => {
      // To be called when user closes the privacy dialog.
      let onFinish = (didAgree: boolean): void => {
        this.setState({
          showingPrivacy: false,
          onPrivacyAgree: null,
          onPrivacyDisagree: null
        });

        if (didAgree) {
          this.props.user.agreeToPrivacy();
          res();
        } else {
          rej();
        }
      };

      this.setState({
        showingPrivacy: true,
        onPrivacyAgree: onFinish.bind(this, true),
        onPrivacyDisagree: onFinish.bind(this, false)
      });
    });
  }

  private uploadRecordings(recordings: any[],
                           sentences: string[]): Promise<void> {

    return new Promise<void>((res, rej) => {
      this.ensurePrivacyAgreement().then(() => {
        let runningTotal = 0;

        // This function calls itself recursively until
        // all recordings are uploaded.
        let uploadNext = () => {
          if (recordings.length === 0) {
            this.props.api.uploadDemographicInfo().then(() => {
              console.log('Uploaded demographic info');
            });
            res();
            return;
          }

          let recording = recordings.pop();
          let blob = recording.blob;
          let sentence = sentences.pop();

          this.props.api.uploadAudio(blob, sentence).then(() => {
            // TODO: figure out how to pass progress into record component.
            // runningTotal += 100 / SET_COUNT;
            // this.setState({ uploadProgress: runningTotal });
            this.props.user.tallyRecording();
            uploadNext();
          });
        };

        // Start the recursive chain to upload the recordings serially.
        uploadNext();
      }).catch(rej);
    }).then(() => {
      this.setState({
        robot: ''
      });
    });
  }

  componentDidMount() {
    this.scroller = document.getElementById('scroller');
    this.content = document.getElementById('content');
    this.header = document.querySelector('header');
    this.addScrollListener();
    this.setState({
      currentPage: this.props.currentPage,
    });
  }

  componentWillUpdate(nextProps: PagesProps) {
    // When the current page changes, hide the menu.
    if (nextProps.currentPage !== this.props.currentPage) {
      var self = this;
      this.content.addEventListener('transitionend', function remove() {
        self.content.removeEventListener('transitionend', remove);
        self.scroller.scrollTop = 0; // scroll back to the top of the page
        self.setState({
          currentPage: nextProps.currentPage,
          pageTransitioning: false,
          isMenuVisible: false
        });
      });

      this.setState({
        pageTransitioning: true
      });
    }
  }

  toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  }

  render() {
    let pageName = this.getCurrentPageName();
    let robotPosition = pageName === 'record' ? this.state.robot : pageName;

    let className = (pageName ? pageName : 'home') +
                    (this.state.recording ? ' recording' : '');
    return <div id="main" className={className}>
      <header className={(this.state.isMenuVisible || this.state.scrolled ?
                          'active' : '')}>
        <Logo navigate={this.props.navigate}/>
        {this.renderUser()}
        <button id="hamburger-menu" onClick={this.toggleMenu}
          className={(this.state.isMenuVisible ? ' is-active' : '')}>
          <Icon type="hamburger" />
        </button>
        {this.renderNav('main-nav')}
      </header>
      <div id="scroller"><div id="scrollee">
        <div class="hero">
          <Robot position={(pageName === 'record' && this.state.robot) ||
                           pageName} onClick={page => {
            this.props.navigate('/' + page); 
          }} />
        </div>
        <div class="hero-space"></div>
        <div id="content" className={this.state.pageTransitioning ?
                                     'transitioning': ''}>
          <Home active={this.isPageActive([URLS.HOME, URLS.ROOT])}
                navigate={this.props.navigate}
                api={this.props.api} user={this.props.user} />
          <Record active={this.isPageActive(URLS.RECORD)} api={this.props.api}
                  onRecord={this.onRecord}
                  onRecordStop={this.onRecordStop}
                  onRecordingSet={this.sayThanks}
                  onSubmit={this.uploadRecordings}
                  navigate={this.props.navigate} user={this.props.user} />
          <Listen active={this.isPageActive(URLS.LISTEN)}
                  navigate={this.props.navigate}
                  api={this.props.api} user={this.props.user}/>
          <Profile user={this.props.user}
                   active={this.isPageActive(URLS.PROFILE)} />
          <Privacy active={this.isPageActive(URLS.PRIVACY)} />
          <Terms active={this.isPageActive(URLS.TERMS)} />
          <NotFound active={this.isNotFoundActive()} />
        </div>
        <footer>
          <div id="help-links">
            <div class="content">
              <a id="contribute"
                 target="_blank" href="https://github.com/mozilla/voice-web">
                <Icon type="github" />
                <p class="strong">Contribute</p>
                <p>on GitHub</p>
              </a>
            </div>
          </div>
          <div id="moz-links">
            <div class="content">
              <Logo navigate={this.props.navigate}/>
              <div class="links">
                <p>
                  <a onClick={evt => {
                    evt.stopPropagation();
                    evt.preventDefault();
                    this.props.navigate('/privacy');
                  }} href="/privacy">Privacy</a>
                  <a href="https://www.mozilla.org/en-US/privacy/websites/#cookies">Cookies</a>
                  <a href="https://www.mozilla.org/en-US/about/legal/">
                    Legal</a>
                  <a href="/">About Project Common Voice</a>
                </p>
                <p>Content available under a&nbsp;<a href="https://www.mozilla.org/en-US/foundation/licensing/website-content/">Creative Commons license</a></p>
              </div>
            </div>
          </div>
        </footer>
      </div></div>
      <div id="navigation-modal"
           className={this.state.isMenuVisible && 'is-active'}>
      {this.renderNav()}
      </div>
      <div className={'overlay' + (this.state.showingPrivacy ? ' active' : '')}>
        <PrivacyContent isForm={true}
          onAgree={this.state.onPrivacyAgree} onDisagree={this.state.onPrivacyDisagree} />
      </div>
    </div>;
  }

  private renderTab(url: string, name: string) {
    let c = 'tab ' + this.isPageActive(url, this.props.currentPage);
    return <a className={c}
              onClick={this.props.navigate.bind(null, url)}>
             <span className={'tab-name ' + name}>{name}</span>
           </a>;
  }

  private renderNav(id?: string) {
    return <nav id={id} className="nav-list">
      {this.renderTab('/', 'home')}
      {this.renderTab('/record', 'speak')}
      {this.renderTab('/listen', 'listen')}
      {this.renderTab('/profile', 'profile')}
    </nav>;
  }

  private renderUser() {
    return (
      <div id="tally-box">
        <span class="tally-recordings">
          {this.props.user.state.recordTally}
        </span>
        <span class="tally-verifications">
          {this.props.user.state.validateTally}
        </span>
      </div>
    );
  }
}
