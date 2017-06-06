import { h, Component } from 'preact';
import About from './pages/about';
import Home from './pages/home';
import Listen from './pages/listen';
import Record from './pages/record';
import User from './user';

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

  private renderCurrentPage(): any {
    switch (this.props.currentPage) {
      case '/':
      case '/home':
        return <Home navigate={this.props.navigate} />;
      case '/record':
        return <Record user={this.props.user} />;
      case '/listen':
        return <Listen />;
      case '/about':
        return <About />;
      default:
        return <div>Page Not Found</div>;
    }
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
    const renderTab = (url, name) => {
      return <a className={'tab ' + (url === name ? 'active' : '')}
        onClick={(e) => this.props.navigate(url)}>{name}</a>;
    };

    return <div>
      <header>
        <a id="main-logo" href="/" onClick={(e) => this.props.navigate('/')}>Voice<br />Commons</a>
        <button id="hamburger-menu" onClick={this.toggleMenu}
          className={'hamburger hamburger--vortex' + (this.state.isMenuVisible ? ' is-active' : '')} type="button">
          <span className="hamburger-box">
            <span className="hamburger-inner"></span>
          </span>
        </button>
        <nav id="main-nav" className="nav-list">
          {renderTab('/about', 'About')}
          {renderTab('/record', 'Record')}
          {renderTab('/listen', 'Listen')}
        </nav>
      </header>
      {this.renderCurrentPage()}
      <div id="navigation-modal" className={this.state.isMenuVisible && 'is-active'}>
        <nav className="nav-list">
          {renderTab('/about', 'About')}
          {renderTab('/record', 'Record')}
          {renderTab('/listen', 'Listen')}
        </nav>
      </div>
    </div>;
  }
}
