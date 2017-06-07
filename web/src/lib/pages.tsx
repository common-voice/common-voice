import { h, Component } from 'preact';
import Icon from './icon';
import About from './pages/about';
import Home from './pages/home';
import Listen from './pages/listen';
import Record from './pages/record';
import NotFound from './pages/not-found';
import User from './user';

const URLS = {
  ROOT: '/',
  HOME: '/home',
  RECORD: '/record',
  LISTEN: '/listen',
  ABOUT: '/about',
  NOTFOUND: '/not-found'
};

interface PagesProps {
  user: User;
  currentPage: string;
  navigate(url: string): void;
}

interface PagesState {
  isMenuVisible: boolean;
}

export default class Pages extends Component<PagesProps, PagesState> {
  state = {
    isMenuVisible: false
  };

  private isValidPage(url): boolean {
    return Object.keys(URLS).some(key => {
      return URLS[key] === url;
    });
  }

  private isPageActive(url): string {
    if (!Array.isArray(url)) {
      url = [url];
    }

    let isActive = url.some(u => {
      return u === this.props.currentPage;
    });

    return isActive ? 'active' : '';
  }

  private isNotFoundActive(): string {
    return !this.isValidPage(this.props.currentPage) ? 'active' : '';
  }

  private renderTab(url: string, name: string) {
    return <a className={'tab ' + this.isPageActive(url)}
              onClick={this.props.navigate.bind(null, url)}>{name}</a>;
  }

  private renderNav(id?: string) {
    return <nav id={id} className="nav-list">
      {this.renderTab('/', 'Home')}
      {this.renderTab('/about', 'About')}
      {this.renderTab('/record', 'Record')}
      {this.renderTab('/listen', 'Listen')}
    </nav>;
  }

  componentWillUpdate(nextProps: PagesProps) {
    // When the current page changes, hide the menu.
    if (nextProps.currentPage !== this.props.currentPage) {
      this.setState({ isMenuVisible: false });
    }
  }

  toggleMenu = () => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
  }

  render() {
    return <div id="main">
      <header>
        <a id="main-logo" href="/"
          onClick={(evt) =>  {
            evt.preventDefault();
            evt.stopPropagation();
            this.props.navigate('/');
          }}>
          <Icon id="main-icon" type="bullhorn" />
          <span>Common Voice</span><br />
          <span className="powered-by">powered by</span>
          <img id="main-mozilla-logo" src="/img/mozilla.svg" />
        </a>
        <button id="hamburger-menu" onClick={this.toggleMenu}
          className={(this.state.isMenuVisible ? ' is-active' : '')}>
          <Icon type="hamburger" />
        </button>
        {this.renderNav('main-nav')}
      </header>
      <div id="content">
        <Home active={this.isPageActive([URLS.HOME, URLS.ROOT])}
              navigate={this.props.navigate} />
        <Record active={this.isPageActive(URLS.RECORD)}
                user={this.props.user} />
        <Listen active={this.isPageActive(URLS.LISTEN)} />
        <About active={this.isPageActive(URLS.ABOUT)} />
        <NotFound active={this.isNotFoundActive()} />
      </div>
      <div id="navigation-modal"
           className={this.state.isMenuVisible && 'is-active'}>
      {this.renderNav()}
      </div>
    </div>;
  }
}
