import { h, Component } from 'preact';
import TermsContent from '../terms-content';

interface Props {
  path: string;
}

interface State {}

export default class Terms extends Component<Props, State> {
  render() {
    return (
      <div id="terms-container" className={'active'}>
        <TermsContent />
      </div>
    );
  }
}
