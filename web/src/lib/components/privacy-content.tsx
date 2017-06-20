import { h, Component } from 'preact';

interface Props {
  isForm?: boolean;
  onAgree?(evt): void;
  onDisagree?(evt): void;
}

interface State {
}

export default class PrivacyContent extends Component<Props, State> {
  render() {
    let formHeader = this.props.isForm ? <h2>By using Common Voice, you agree to our <a target="_blank" href="/terms">Terms</a> and <a target="_blank" href="/privacy">Privacy Notice.</a></h2> : '';

    let buttons = this.props.isForm ? <div class="button-holder">
      <button onClick={this.props.onAgree}>I agree</button>
      <button onClick={this.props.onDisagree}>I do not agree</button>
    </div> : '';

    return <div class="privacy-content">
      <h1>Common Voice Privacy Notice</h1>
      <h2>Effective June 19, 2017</h2>
      {formHeader}
      <p>When Mozilla (that’s us), receives information
         from you, our <a target="_blank" href="https://www.mozilla.org/privacy">Mozilla Privacy Policy</a> describes how we handle that information.</p>
      <ul>
        <li><b>Demographic data.</b>You can optionally send
            us information such as your accent, age, and gender.
            This helps us and other researchers improve and create
            speech-to-text technology and tools.</li>
        <li><b>Account data.</b>You can optionally create an account,
            in which case we receive your email address. This is
            associated with your demographic and interaction data
            but is not shared to the public.</li>
        <li><b>Voice Recordings.</b>Voice recordings, along with any
            associated demographic data, may be available in the
            Common Voice database for public consumption and use.</li>
        <li><b>Interaction data.</b>We use Google Analytics to better
            understand how you interact with the Common Voice app or
            website.  For example, this includes number of voice samples
            you record or listen to, interactions with buttons and menus,
            session length.</li>
        <li><b>Technical data.</b>Using Google Analytics, we collect the
            URL and title of the Common Voice pages you visit. We collect
            your browser, viewport size, and screen resolution. We also
            collect your location, and the language setting in your
            browser.</li>
      </ul>
      <a target="_blank"
         href="https://github.com/mozilla/voice-web/blob/data-dictionary/docs/data_dictionary.md">
        Learn more
      </a>
      {buttons}
    </div>;
  }
}
