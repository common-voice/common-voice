import * as React from 'react';

interface Props {
  disabled: boolean;
  percent: number;
  text: string;
  onClick?(): void;
}

interface State {}

/**
 * Widget for listening to a recording.
 */
export default class ProgressButton extends React.Component<Props, State> {
  render() {
    return (
      <button
        className="progress-button"
        onClick={this.props.onClick}
        disabled={this.props.disabled}>
        <span
          className="progress"
          style={{ transform: 'translateX(${this.props.percent - 100}%)' }}
        />
        {this.props.text}
      </button>
    );
  }
}
