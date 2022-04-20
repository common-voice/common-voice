import * as React from 'react';
import { CloseIcon } from '../ui/icons';

const AUTO_HIDE_TIME_MS = 5000;

interface Props {
  children?: any;
  autoHide: boolean;
  onClose: Function;
  type?: 'success' | 'error';
}

export default class Alert extends React.Component<Props, {}> {
  static defaultProps = {
    type: 'success',
  };

  timeout: number;

  componentDidMount() {
    this.startTimer({}, this.props);
  }

  componentDidUpdate(prevProps: Props) {
    this.startTimer(this.props, prevProps);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  private startTimer(prevProps: any, { autoHide, onClose }: Props) {
    if (autoHide && autoHide !== prevProps.autoHide) {
      clearTimeout(this.timeout);

      this.timeout = setTimeout(onClose, AUTO_HIDE_TIME_MS);
    }

    if (!autoHide) {
      clearTimeout(this.timeout);
    }
  }

  private close = () => {
    clearTimeout(this.timeout);
    this.props.onClose();
  };

  render() {
    return (
      <div className={'alert ' + this.props.type}>
        {this.props.children}

        <CloseIcon onClick={this.close} className="icon" />
      </div>
    );
  }
}
