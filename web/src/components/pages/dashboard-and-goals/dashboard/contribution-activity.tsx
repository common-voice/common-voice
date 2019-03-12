import * as React from 'react';
import { connect } from 'react-redux';
import API from '../../../../services/api';
import StateTree from '../../../../stores/tree';
import { BarPlot } from '../../../plot/plot';

interface PropsFromState {
  api: API;
}

interface Props extends PropsFromState {
  locale: string;
  from: 'you' | 'everyone';
}

interface State {
  data: any[];
}

class ContributionActivity extends React.Component<Props> {
  state: State = { data: [] };

  async componentDidMount() {
    const { api, from, locale } = this.props;
    await this.setState({
      data: await api.fetchContributionActivity(from, locale),
    });
  }
  render() {
    return <BarPlot data={this.state.data} />;
  }
}

export default connect<PropsFromState>(({ api }: StateTree) => ({ api }))(
  ContributionActivity
);
