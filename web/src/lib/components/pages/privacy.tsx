import { h, Component } from 'preact';
import PrivacyContent from '../privacy-content';

interface Props {
  active: string;
}

interface State {
}

export default class Privacy extends Component<Props, State> {
  render() {
    return <div id="privacy-container" className={this.props.active}>
      <PrivacyContent />
    </div>;
  }
}
