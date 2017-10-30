import { h, Component } from 'preact';
import API from '../../api';
import Validator from '../validator';
import User from '../../user';

interface ListenPageProps {
  user: User;
  api: API;
  active: string;
  navigate(url: string): void;
}

export default class Listen extends Component<ListenPageProps, void> {
  constructor(props: ListenPageProps) {
    super(props);
    this.onVote = this.onVote.bind(this);
  }

  onVote() {
    this.props.user.tallyVerification();
    this.props.navigate('/listen'); // force page render
  }

  render() {
    return (
      <div id="listen-container" className={this.props.active}>
        <Validator onVote={this.onVote} api={this.props.api} />
      </div>
    );
  }
}
