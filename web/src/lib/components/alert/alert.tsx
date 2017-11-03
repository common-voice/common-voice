import { h, Component } from 'preact';
import Icon from '../icon';

interface Props {
  text: string;
  active: boolean;
  autoHide: boolean;
  onClose: Function;
}

export default class Alert extends Component<Props, void> {
  timeout: number;

  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  componentWillUpdate({ active, autoHide }: Props) {
    if (autoHide && active !== this.props.active) {
      if (active) {
        this.timeout = setTimeout(this.props.onClose, 5000);
      } else {
        clearTimeout(this.timeout);
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  private onClick() {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    this.props.onClose();
  }

  render() {
    if (!this.props.active) {
      return null;
    }

    return (
      <div className="alert">
        {this.props.text}

        <Icon type="x" onClick={this.onClick} className="icon" />
      </div>
    );
  }
}
