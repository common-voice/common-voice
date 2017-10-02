import { h, Component } from 'preact';
import PrivacyContent from '../privacy-content';

interface Props {
  path: string;
}

interface State {}

export default class Privacy extends Component<Props, State> {
  render() {
    return (
      <div id="privacy-container" className={'active'}>
        <PrivacyContent />
      </div>
    );
  }
}
