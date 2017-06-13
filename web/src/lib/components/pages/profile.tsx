import { h, Component } from 'preact';

interface Props {
  active: string;
}

interface State {

}

export default class Home extends Component<Props, State> {
  render() {
    return <div id="profile-container" className={this.props.active}>
      Profile Page
    </div>;
  }
}
