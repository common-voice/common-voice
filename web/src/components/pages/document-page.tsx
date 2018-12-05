import * as React from 'react';
import StateTree from '../../stores/tree';
import { connect } from 'react-redux';
import API from '../../services/api';

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

  async componentDidUpdate() {
    await this.fetchDocument();
  }

  private async fetchDocument() {
    const { api, name } = this.props;
    this.setState({
      html: await api.fetchDocument(name),
    });
  }

  render() {
    return <div dangerouslySetInnerHTML={{ __html: this.state.html }} />;
  }
}

const mapStateToProps = ({ api }: StateTree) => ({
  api,
});

export default connect<PropsFromState>(mapStateToProps)(DocumentPage);
