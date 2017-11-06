import { h, Component } from 'preact';
import Icon from '../icon';

const AUTO_HIDE_TIME_MS = 5000;

interface Props {
  children?: any;
  autoHide: boolean;
  onClose: Function;
}

export default class Alert extends Component<Props, void> {
  timeout: number;

  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
    this.startTimer({}, props);
  }

  componentWillReceiveProps(nextProps: Props) {
    this.startTimer(this.props, nextProps);
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

  private onClick() {
    clearTimeout(this.timeout);
    this.props.onClose();
  }

  render() {
    return (
      <div className="alert">
        {this.props.children}

        <Icon type="x" onClick={this.onClick} className="icon" />
      </div>
    );
  }
}
