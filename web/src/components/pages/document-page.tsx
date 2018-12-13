import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../services/api';
import StateTree from '../../stores/tree';
import { Spinner } from '../ui/ui';

interface PropsFromState {
  api: API;
}

class DocumentPage extends React.Component<
  { name: 'privacy' | 'terms' } & PropsFromState,
  { html: string }
> {
  state = {
    html: '',
  };

  async componentDidMount() {
    await this.fetchDocument();
  }

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

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(DocumentPage);
