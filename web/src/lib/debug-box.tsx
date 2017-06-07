import { h, Component } from 'preact';

interface Props {
}

interface State {
  messages: string[];
}

/**
 * Allows us to see console log on the ios app.
 */
export default class DebugBox extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  private addMessage(message: string) {
    let messages = this.state.messages;
    messages.push(message);
    this.setState({
      messages: messages
    });
  }

  private renderMessages() {
    return this.state.messages.map(message => {
      return <p>{message}</p>;
    });
  }

  componentDidMount() {
    let log = window.console.log.bind(window.console);
    window.console.log = (...args) => {
      log(...args);
      this.addMessage(args.join(', '));
    }

    let err = window.console.error.bind(window.console);
    window.console.error = (...args) => {
      err(...args);
      this.addMessage(args.join(', '));
    }

    if (!window.onerror) {
      window.onerror = (err: any) => {
        console.log('got a top level error', err, err.stack);
      };
    }
  }

  render() {
    let maybeHide = this.state.messages.length < 1 ? 'hidden': '';

    return <div className={maybeHide} id="debug-box">
      {this.renderMessages()}</div>;
  }
}
