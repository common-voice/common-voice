import { h, Component } from 'preact';
import { getItunesURL } from '../utility';
import Logo from './logo';
import Icon from './icon';
import PrivacyContent from './privacy-content';
import Robot from './robot';

import Home from './pages/home';
import Listen from './pages/listen';
import Record from './pages/record';
import Profile from './pages/profile';
import FAQ from './pages/faq';
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
  FAQ: '/faq',
  PRIVACY: '/privacy',
  TERMS: '/terms',
  NOTFOUND: '/not-found'
};

const ROBOT_TALK = {
  'home': [
    <p>Greetings human!</p>,
    <p>My name is M.A.R.S. and I am a learning robot.</p>,
    <p>Right now, I am learning to speak like a human.</p>,
    <p>But. . .  it's so hard!</p>,
    <p>Can you help me learn?</p>,
    <p>All I need is for you to read to me. :)</p>,
    <p>Please click on the heart below to get started teaching me.</p>,
  ]
}

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
  transitioning: boolean;
  recording: boolean;
  robot: string;
  onPrivacyAction(didAgree: boolean): void;
  recorderVolume: number;
}

export default class Pages extends Component<PagesProps, PagesState> {
  private header: HTMLElement;
  private scroller: HTMLElement;
  private content: HTMLElement;
  private bg: HTMLElement;

  state = {
    isMenuVisible: false,
    pageTransitioning: false,
    scrolled: false,
    currentPage: null,
    showingPrivacy: false,
    transitioning: false,
    recording: false,
    robot: '',
    onPrivacyAction: undefined,
    recorderVolume: 100
  };

  constructor(props) {
    super(props);
    this.uploadRecordings = this.uploadRecordings.bind(this);
    this.onRecord = this.onRecord.bind(this);
    this.onRecordStop = this.onRecordStop.bind(this);
    this.sayThanks = this.sayThanks.bind(this);
    this.renderUser = this.renderUser.bind(this);
    this.linkNavigate = this.linkNavigate.bind(this);
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

  private openInApp() {
    window.location.href = getItunesURL();
  }

  private closeOpenInApp(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    document.getElementById('install-app').classList.add('hide');
  }

  private getCurrentPageName() {
    if (!this.state.currentPage) {
      return 'home';
    }

    let p = this.state.currentPage.substr(1);
    p = p || 'home';
    return p;
  }

  private sayThanks(): void {
    this.setState({
      robot: 'thanks'
    });
  }

  private clearRobot(): void {
    this.setState({
      robot: ''
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

    // Callback function for when we've hidden the normal background.
    let cb = () => {
      console.log('does this ever happen?');
      this.bg.removeEventListener('transitionend', cb);
      this.setState({
        transitioning: false,
        recording: true
      });
    };
    this.bg.addEventListener('transitionend', cb);

    this.setState({
      transitioning: true,
      recording: false
    });
  }

  private onRecordStop() {
    this.setState({
      recording: false
    });
  }

  private addScrollListener() { this.scroller.addEventListener('scroll', evt => {
      let scrolled = this.scroller.scrollTop > 0;
      if (scrolled !== this.state.scrolled) {
        this.setState({ scrolled: scrolled });
      }
    });
  }

  private linkNavigate(evt: Event): void {
    evt.stopPropagation();
    evt.preventDefault();
    let href = (evt.currentTarget as HTMLAnchorElement).href;
    this.props.navigate(href);
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
          onPrivacyAction: undefined
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
        onPrivacyAction: onFinish
      });
    });
  }

  private uploadRecordings(recordings: any[],
                           sentences: string[],
                           progressCb: Function): Promise<void> {

    return new Promise<void>((res, rej) => {
      this.ensurePrivacyAgreement().then(() => {
        let runningTotal = 0;
        let originalTotal = recordings.length;

        // This function calls itself recursively until
        // all recordings are uploaded.
        let uploadNext = () => {
          if (recordings.length === 0) {
            this.props.api.uploadDemographicInfo().then(() => {
              return;
            });
            res();
            return;
          }

          let recording = recordings.pop();
          let blob = recording.blob;
          let sentence = sentences.pop();

          this.props.api.uploadAudio(blob, sentence).then(() => {
            runningTotal++;
            let percentage = Math.floor((runningTotal / originalTotal) * 100);
            progressCb && progressCb(percentage);
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
    this.bg = document.getElementById('background-container');
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
    let className = pageName;
    if (this.state.transitioning) {
      className += ' hiding';
    } else if (this.state.recording) {
      className += ' recording';
    }

    let bgStyle = '';
    if (this.state.recording) {
      let scale = Math.max(( 1.3 * (this.state.recorderVolume - 28) / 100 ), 0);
      bgStyle = 'transform: scaleY(' + scale + ');';
    }

    return <div id="main" className={className}>
      <div onClick={this.openInApp} id="install-app">Open in App
        <a onClick={this.closeOpenInApp}>X</a></div>
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
        <div id="background-container" style={bgStyle}></div>
        <div class="hero">
          <Robot position={(pageName === 'record' && this.state.robot) ||
                           pageName} onClick={page => {
            this.props.navigate('/' + page);
          //}}>{ROBOT_TALK[pageName]}</Robot> (Disable talking robot for now)
          }}></Robot>
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
                  onVolume={this.onVolume}
                  onSubmit={this.uploadRecordings}
                  onDelete={this.clearRobot}
                  navigate={this.props.navigate} user={this.props.user} />
          <Listen active={this.isPageActive(URLS.LISTEN)}
                  navigate={this.props.navigate}
                  api={this.props.api} user={this.props.user}/>
          <Profile user={this.props.user}
                   active={this.isPageActive(URLS.PROFILE)} />
          <FAQ active={this.isPageActive(URLS.FAQ)} />
          <Privacy active={this.isPageActive(URLS.PRIVACY)} />
          <Terms active={this.isPageActive(URLS.TERMS)} />
          <NotFound active={this.isNotFoundActive()} />
        </div>
        <footer>
          <div id="help-links">
            <div class="content">
              <a id="help" onClick={this.linkNavigate}
                 href="/faq">
                <Icon type="help" />
                <p class="strong">Help</p>
              </a>
              <a id="contribute"
                 target="_blank" href="https://github.com/mozilla/voice-web">
                <Icon type="github" />
                <p class="strong">Contribute</p>
              </a>
            </div>
          </div>
          <div id="moz-links">
            <div class="content">
              <Logo navigate={this.props.navigate}/>
              <div class="links">
                <p>
                  <a onClick={this.linkNavigate} href="/privacy">Privacy</a>
                  <a onClick={this.linkNavigate} href="/terms">Terms</a>
                  <a target="_blank" href="https://www.mozilla.org/en-US/privacy/websites/#cookies">Cookies</a>
                  <a onClick={this.linkNavigate} href="/faq">FAQ</a>
                  <a target="blank" href="https://discourse.mozilla-community.org/c/voice">Discourse</a>
                </p>
                <p>Content available under a&nbsp;<a target="_blank" href="https://www.mozilla.org/en-US/foundation/licensing/website-content/">Creative Commons license</a></p>
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
        <div class="privacy-content">
          <h2>By using Common Voice, you agree to our <a target="_blank" href="/terms">Terms</a> and <a target="_blank" href="/privacy">Privacy Notice</a>.
          </h2>
          <div class="button-holder">
            <button onClick={e => { this.state.onPrivacyAction && this.state.onPrivacyAction(true); }}>I agree</button>
            <button onClick={e => { this.state.onPrivacyAction && this.state.onPrivacyAction(false); }}>I do not agree</button>
          </div>
        </div>
      </div>
    </div>;
  }

  private renderTab(url: string, name: string) {
    let c = 'tab ' + name + ' ' + this.isPageActive(url, this.props.currentPage);
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
