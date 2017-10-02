import { h, Component } from 'preact';
import { route } from 'preact-router';
import { Clip, default as API } from '../../api';
import Validator from '../validator';
import User from '../../user';

interface ListenPageProps {
  user: User;
  api: API;
  path: string;
}

export default class Listen extends Component<ListenPageProps, void> {
  constructor(props: ListenPageProps) {
    super(props);
    this.onVote = this.onVote.bind(this);
  }

  onVote() {
    this.props.user.tallyVerification();
    route('/listen'); // force page render
  }

  render() {
    return (
      <div id="listen-container" className={'active'}>
        <Validator onVote={this.onVote} api={this.props.api} />
      </div>
    );
  }
}
