import { h, Component } from 'preact';
import Icon from '../icon';

interface Props {
  text: string;
  active: boolean;
}

interface State {
  active: boolean;
}

export default class Alert extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  state: State = {
    active: this.props.active,
  };

  componentWillReceiveProps({ active }: Props) {
    if (active !== this.state.active) {
      this.setState({
        active,
      });
    }
  }

  private onClick() {
    this.setState({
      active: false,
    });
  }

  render() {
    if (!this.state.active) {
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
