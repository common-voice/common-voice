import { h, Component } from 'preact';

interface Props {
  disabled: boolean;
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
    return <button className="progress-button" onClick={this.props.onClick}
           disabled={( this.props.disabled ? true: false )} >
        <span class="progress"
          style={`transform: translateX(${this.props.percent - 100}%);`}></span>
        {this.props.text}
      </button>
  }
}
