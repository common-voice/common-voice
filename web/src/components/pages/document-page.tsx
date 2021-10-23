import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../services/api';
import StateTree from '../../stores/tree';
import { Spinner } from '../ui/ui';

interface PropsFromState {
  api: API;
  locale: string;
}

/**
 * Renders an HTML document determined by the <c>name</c> prop.
 * @param {{name:string} & PropsFromState} props Props passed to the component.
 */
class DocumentPage extends React.Component<
  { name: 'privacy' | 'terms' | 'challenge-terms' } & PropsFromState,
  { html: string }
> {
  state = {
    html: '',
  };

  // Whenever locale changes (and on first draw) fetch the document to be displayed.
  async componentDidUpdate() {
    await this.fetchDocument();
  }

  /**
   * Retrieves the document to be displayed and updates state.
   */
  private async fetchDocument() {
    const { api, name } = this.props;
    this.setState({
      html: await api.fetchDocument(name),
    });
  }

  render() {
    const { html } = this.state;
    return html ? (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    ) : (
      <Spinner />
    );
  }
}

/**
 * Maps Redux state to local props for the component
 * @param API api Provides methods for fetching HTML for the page.
 * @param {string} locale Triggers a redraw if the locale is changed in state.
 */
const mapStateToProps = ({api, locale}: StateTree) => ({
  api,
  locale,
});

export default connect<PropsFromState>(mapStateToProps)(DocumentPage);
