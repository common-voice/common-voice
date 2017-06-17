import { h, Component } from 'preact';
import { Clip, default as API } from '../../api';
import Validator from '../validator';

interface ListenPageProps {
  api: API;
  active: string;
}

export default class Listen extends Component<ListenPageProps, void> {
  render() {
    return <div id="listen-container" className={this.props.active}>
        <Validator api={this.props.api} />
    </div>;
  }
}
