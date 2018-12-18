import * as React from 'react';
import StateTree from '../../stores/tree';
import API from '../../services/api';
import { connect } from 'react-redux';
import { CheckIcon, OldPlayIcon, CautionIcon } from '../ui/icons';

import './subscribe-newsletter.css';

interface PropsFromState {
  api: API;
}

interface State {
  email: string;
  buttonStyle: string;
  isSubmitted: boolean;
  isValidEmail: boolean;
}

class SignUp extends React.Component<PropsFromState, State> {
  state = {
    email: '',
    buttonStyle: 'submit-button',
    isSubmitted: false,
    isValidEmail: true,
  };

  handleChange = (event: any) => {
    this.setState({ email: event.target.value });
    this.setState({ isSubmitted: false });
    this.setState({ isValidEmail: true });
    this.setState({ buttonStyle: 'submit-button' });
  };

  private isValidEmailAddress = () => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(this.state.email);
  };

  private subscribe = () => {
    if (this.isValidEmailAddress()) {
      this.subscribeToNewsletter();
    } else {
      this.setState({ buttonStyle: 'error-button' });
      this.setState({ isValidEmail: false });
      this.setState({ isSubmitted: false });
    }
  };

  private subscribeToNewsletter = async () => {
    try {
      await this.props.api.subscribeToNewsletter(this.state.email);
      this.setState({ isSubmitted: true });
      this.setState({ buttonStyle: 'success-button' });
      this.setState({ email: 'Submitted' });
    } catch (err) {
      this.setState({ isValidEmail: false });
      this.setState({ isSubmitted: false });
      this.setState({ buttonStyle: 'error-button' });
      throw new Error(err.message);
    }
  };

  private getButtonHtml = () => {
    if (this.state.isSubmitted) {
      return <CheckIcon className="icon" />;
    } else if (this.state.isValidEmail) {
      return <OldPlayIcon className="icon" />;
    } else {
      return <CautionIcon className="icon" />;
    }
  };

  render() {
    return (
      <span className="subscribe-newsletter">
        <input
          type="email"
          value={this.state.email}
          onChange={this.handleChange}
        />
        <div className={this.state.buttonStyle} onClick={this.subscribe}>
          {this.getButtonHtml()}
        </div>
      </span>
    );
  }
}

export default connect<PropsFromState, State>(({ api }: StateTree) => ({
  api,
}))(SignUp);
