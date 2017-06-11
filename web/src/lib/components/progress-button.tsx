import { h, Component } from 'preact';

interface Props {
  percent: number;
  text: string;
  onClick?(): void;
}

interface State {
}

/**
 * Widget for listening to a recording.
 */
export default class ProgressButton extends Component<Props, State> {
  render() {
    let percent = Math.min(this.props.percent - 100, 0);
    return <button className="progress-button" onClick={this.props.onClick}>
        <span class="progress"
          style={`transform: translateX(${percent}%);`}></span>
        {this.props.text}
      </button>
  }
}
