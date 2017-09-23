import { h, Component } from 'preact';

const HIDE_DELAY = 4000;

interface Props {
}

interface State {
  messages: string[];
}

/**
 * Allows us to see console log on the ios app.
 */
export default class DebugBox extends Component<Props, State> {
  hideTimeout: any;

  constructor(props?: Props) {
    super(props);
    this.state = {
      messages: []
    };
  }

  private addMessage(message: string) {
    let messages = this.state.messages;
    messages.unshift(message);
    this.setState({
      messages: messages
    });

    // Hide the box after a short delay.
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
    }

    this.hideTimeout = setTimeout(() => {
      this.setState({
        messages: []
      });
    }, HIDE_DELAY);
  }

  private renderMessages() {
    return this.state.messages.map(message => {
      return <p>{message}</p>;
    });
  }

  componentDidMount() {
    let log = window.console.log.bind(window.console);
    window.console.log = (...args: any[]) => {
      log(...args);
      this.addMessage(args.join(', '));
    }

    let err = window.console.error.bind(window.console);
    window.console.error = (...args: any[]) => {
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
