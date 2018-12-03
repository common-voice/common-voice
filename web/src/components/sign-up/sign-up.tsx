import * as React from 'react';
//import { SubmitButton } from '../primary-buttons/primary-buttons';
import { Localized } from 'fluent-react/compat';

// const initialState = { submitted: boolean; }
// type State = Readonly<typeof initialState>

interface State {
  submitted: boolean;
}

class SignUp extends React.Component<any, State> {
  //var submitted = false;
  //public readonly state: State = { submitted: false };

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      submitted: false,
    };
  }

  // componentDidMount() {
  //   this.setState({ submitted: false });
  // }

  private toggleSubmitted = () => {
    this.setState(state => ({ submitted: !state.submitted }));
  };

  render() {
    return (
      <div id="email-subscription">
        <Localized id="email-subscription-title">
          <span className="title" />
        </Localized>
        <span className="submission">
          <input className="input" type="text" />
          <div className="submit" onClick={this.toggleSubmitted}>
            {/* <SubmitButton /> */}
            {/* {this.submitted} */}
          </div>
        </span>
      </div>
    );
  }
}

export default SignUp;
