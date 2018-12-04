import * as React from 'react';
import { Localized } from 'fluent-react/compat';
import StateTree from '../../stores/tree';
import API from '../../services/api';
import { connect } from 'react-redux';
import {
  CheckIcon,
  PlayIcon,
  ChevronRight,
  OldPlayIcon,
  CrossIcon,
  CautionIcon,
} from '../ui/icons';

import './sign-up.css';

interface PropsFromState {
  api: API;
}

interface State {
  email: string;
  isSubmitted: boolean;
  isValidEmail: boolean;
}

class SignUp extends React.Component<PropsFromState, State> {
  constructor(props: PropsFromState, context: any) {
    super(props, context);
    const { api } = this.props;
    this.state = {
      email: '',
      isSubmitted: false,
      isValidEmail: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.isValidEmailAddress = this.isValidEmailAddress.bind(this);
  }

  handleChange(event: any) {
    this.setState({ email: event.target.value });
  }

  private isValidEmailAddress() {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    this.setState({
      isValidEmail: re.test(this.state.email),
    });
    return re.test(this.state.email);
    console.log(this.state.isValidEmail);
  }

  private subscribeToNewsletter = () => {
    console.log('?');
    if (this.isValidEmailAddress()) {
      this.props.api
        .subscribeToNewsletter('test@mailinator.com')
        .then(result => {
          console.log(result);
          this.setState({ isSubmitted: true });
          this.setState({ email: 'Submitted' });
        });
    }
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
            type="email"
            value={this.state.email}
            onChange={this.handleChange}
            onBlur={() => {
              this.setState({ isSubmitted: false });
            }}
          />
          <div className="submit" onClick={this.subscribeToNewsletter}>
            {this.state.isSubmitted ? (
              <CheckIcon className="icon" />
            ) : this.state.isValidEmail ? (
              <OldPlayIcon className="icon" />
            ) : (
              <CautionIcon className="icon" />
            )}
          </div>
        </span>
      </div>
    );
  }
}

export default connect<PropsFromState, State>(({ api }: StateTree) => ({
  api,
}))(SignUp);
