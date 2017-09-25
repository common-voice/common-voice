import { h, Component } from 'preact';

interface Props {
  active: string;
}

export default class NotFound extends Component<Props, void> {
  render() {
    return (
      <div id="not-found-container" className={this.props.active}>
        <h2>Not found</h2>
        <p>I'm afraid I don't know what you're looking for.</p>
      </div>
    );
  }
}
