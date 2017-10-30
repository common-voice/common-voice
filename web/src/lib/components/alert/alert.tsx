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
    active: false,
  };

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.active !== this.props.active) {
      this.setState({
        active: nextProps.active,
      });
    }
  }

  private onClick() {
    this.setState({
      active: false,
    });
  }

  render() {
    const className = 'alert ' + (this.state.active ? 'active' : '');

    return (
      <div className={className}>
        {this.props.text}

        <Icon type="x" onClick={this.onClick} className="icon" />
      </div>
    );
  }
}
