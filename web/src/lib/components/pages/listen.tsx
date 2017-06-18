import { h, Component } from 'preact';
import { Clip, default as API } from '../../api';
import Validator from '../validator';
import User from '../../user';

interface ListenPageProps {
  user: User;
  api: API;
  active: string;
  navigate(url: string): void;
}

export default class Listen extends Component<ListenPageProps, void> {
  render() {
    return <div id="listen-container" className={this.props.active}>
        <Validator onVote={() => {console.log('got iddddd');}} api={this.props.api} />
    </div>;
  }
}
