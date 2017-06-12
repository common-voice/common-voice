import { h, Component } from 'preact';
import Icon from './icon';
import Home from './pages/home';
import Listen from './pages/listen';
import Record from './pages/record';
import NotFound from './pages/not-found';
import User from '../user';

const URLS = {
  ROOT: '/',
  HOME: '/home',
  RECORD: '/record',
  LISTEN: '/listen',
  NOTFOUND: '/not-found'
};

interface PagesProps {
  user: User;
  currentPage: string;
  navigate(url: string): void;
}

interface PagesState {
  isMenuVisible: boolean;
  pageTransitioning: boolean;
  scrolled: boolean;
  currentPage: string;
}

export default class Pages extends Component<PagesProps, PagesState> {
  private header: HTMLElement;
  private content: HTMLElement;

  state = {
    isMenuVisible: false,
    pageTransitioning: false,
    scrolled: false,
    currentPage: null
  };

  private getCurrentPageName() {
    return this.state.currentPage && this.state.currentPage.substr(1);
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

  private addScrollListener() {
    this.content.addEventListener('scroll', evt => {
      let scrolled = this.content.scrollTop > 0;
      if (scrolled !== this.state.scrolled) {
        this.setState({ scrolled: scrolled });
      }
    });
  }

  componentDidMount() {
    this.content = document.getElementById('content');
    this.header = document.querySelector('header');
    this.addScrollListener();
    this.setState({
      currentPage: this.props.currentPage,
    });
  }

  private isNotFoundActive(): string {
    return !this.isValidPage(this.props.currentPage) ? 'active' : '';
  }

  componentWillUpdate(nextProps: PagesProps) {
    // When the current page changes, hide the menu.
    if (nextProps.currentPage !== this.props.currentPage) {
      var self = this;
      this.content.addEventListener('transitionend', function remove() {
        self.content.removeEventListener('transitionend', remove);
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
    return <div id="main" className={pageName}>
      <header className={(this.state.isMenuVisible || this.state.scrolled ?
                          'active' : '')}>
        <a id="main-logo" href="/"
          onClick={(evt) =>  {
            evt.preventDefault();
            evt.stopPropagation();
            this.props.navigate('/');
          }}>
          <span id="main-title">Common Voice</span><br />
          <img id="main-mozilla-logo" src="/img/mozilla.svg" />
        </a>
        <button id="hamburger-menu" onClick={this.toggleMenu}
          className={(this.state.isMenuVisible ? ' is-active' : '')}>
          <Icon type="hamburger" />
        </button>
        {this.renderNav('main-nav')}
      </header>
      <div class="hero">
        <img className="robot" src="/img/robot.png" />
        <div class="divider"></div>
      </div>
      <div id="content" className={this.state.pageTransitioning ?
                                   'transitioning': ''}>
        <Home active={this.isPageActive([URLS.HOME, URLS.ROOT])}
              navigate={this.props.navigate} />
        <Record active={this.isPageActive(URLS.RECORD)}
                user={this.props.user} />
        <Listen active={this.isPageActive(URLS.LISTEN)} />
        <NotFound active={this.isNotFoundActive()} />
        <footer></footer>
      </div>
      <div id="navigation-modal"
           className={this.state.isMenuVisible && 'is-active'}>
      {this.renderNav()}
      </div>
    </div>;
  }

  private renderTab(url: string, name: string) {
    return <a className={'tab ' + this.isPageActive(url, this.props.currentPage)}
              onClick={this.props.navigate.bind(null, url)}>
             <span className="tab-name">{name}</span>
           </a>;
  }

  private renderNav(id?: string) {
    return <nav id={id} className="nav-list">
      {this.renderTab('/', 'about')}
      {this.renderTab('/record', 'record')}
      {this.renderTab('/listen', 'listen')}
    </nav>;
  }
}
