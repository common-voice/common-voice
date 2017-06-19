import { h, Component } from 'preact';
import TermsContent from '../terms-content';

interface Props {
  active: string;
}

interface State {
}

export default class Terms extends Component<Props, State> {
  render() {
    return <div id="terms-container" className={this.props.active}>
      <TermsContent />
    </div>;
  }
}
