import * as React from 'react';
import { Provider } from 'react-redux';
import Pages from './pages';
import { isMobileWebkit, isFocus, isNativeIOS } from '../utility';
import store from '../stores/root';

export default class App extends React.Component<{}, {}> {
  componentDidMount() {
    if (isNativeIOS()) {
      this.bootstrapIOS();
    }

    if (isFocus()) {
      document.body.classList.add('focus');
    }

    if (isMobileWebkit()) {
      document.body.classList.add('mobile-safari');
    }
  }

  /**
   * Perform any native iOS specific operations.
   */
  private bootstrapIOS() {
    document.body.classList.add('ios');
  }

  render() {
    return (
      <Provider store={store}>
        <Pages match={null} location={null} history={null} />
      </Provider>
    );
  }
}
