import { h, Component } from 'preact';

const ICONS = {
  bullhorn: '',
  hamburger: ''
}

interface Props {
  id?: string;
  type: string;
}

/**
 * Helper component for using icon fonts.
 */
export default class Icon extends Component<Props, void> {
  getIcon(name: string): string {
    return ICONS[name] || '';
  }

  render() {
    let icon = this.getIcon(this.props.type);
    return <span id={this.props.id} aria-hidden="true"
                 data-icon={icon}></span>;
  }
}
