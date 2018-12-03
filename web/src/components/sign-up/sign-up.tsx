import * as React from 'react';
import { SubmitButton, SentButton } from '../primary-buttons/primary-buttons';
import { Localized } from 'fluent-react/compat';
import StateTree from '../../stores/tree';
import API from '../../services/api';
import { connect } from 'react-redux';

interface PropsFromState {
  api: API;
}

interface State {
  email: string;
  sent: boolean;
  validEmail: boolean;
}

class SignUp extends React.Component<PropsFromState, State> {
  constructor(props: PropsFromState, context: any) {
    super(props, context);
    const { api } = this.props;
    this.state = {
      email: '',
      sent: false,
      validEmail: false,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event: any) {
    this.setState({ email: event.target.value });
  }

  private subscribeToNewsletter = () => {
    console.log(this.state.email);
    //let lang = this.props.api.subscribeToNewsletter(this.state.email);
    this.props.api.subscribeToNewsletter('test@mailinator.com').then(result => {
      console.log(result);
    });
  };

  render() {
    const { api } = this.props;

    return (
      <div id="email-subscription">
        <Localized id="email-subscription-title">
          <span className="title" />
        </Localized>
        <span className="submission">
          <input
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <div className="submit" onClick={() => this.subscribeToNewsletter()}>
            <SentButton />
          </div>
        </span>
      </div>
    );
  }
}

export default connect<PropsFromState, State>(({ api }: StateTree) => ({
  api,
}))(SignUp);
